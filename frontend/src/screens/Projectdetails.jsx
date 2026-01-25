import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "../config/axios.js";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket.js";
import { UserContext } from "../context/user.context.jsx";
import Markdown from "markdown-to-jsx";
import { getWebContainer } from "../config/webContainer.js";
import hljs from "highlight.js";
import "/src/hljs.css";

function HighlightedCode(props) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && hljs) {
      hljs.highlightElement(ref.current);
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const Projectdetails = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());

  const [project, setProject] = useState(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [users, setUsers] = useState([]);


  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageBox = useRef(null);


  const [iframeUrl, setIframeUrl] = useState(null);
  const [runProcess, setRunProcess] = useState(null);
  const [isIframeOpen, setIsIframeOpen] = useState(false);
  const [webContainer, setWebContainer] = useState(null);

  const [fileTree, setFileTree] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);

  const socketInitialized = useRef(false);
  const webContainerInitialized = useRef(false);

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }
      return newSelectedUserId;
    });
  };


  const addCollaborators = async () => {
    if (!project?._id || selectedUserId.size === 0) return;

    try {
      const response = await axios.put("/projects/add-user", {
        projectId: project._id,
        users: Array.from(selectedUserId).map((id) => id.toString()),
      });


      if (response.data.project) {
        setProject(response.data.project);
      }
      
      setIsModalOpen(false);
      setSelectedUserId(new Set());
    } catch (err) {
      console.error("Error adding collaborators:", err);
      alert("Failed to add collaborators. Please try again.");
    }
  };

  const aiMessage = (message) => {
    let parsed = { text: message };

    try {
      parsed = JSON.parse(message);
    } catch (err) {
      parsed = { text: message };
    }

    return (
      <div className="overflow-auto bg-slate-950 text-white rounded-md p-3">
        <Markdown
          children={parsed.text || ""}
          options={{
            overrides: {
              code: HighlightedCode,
            },
          }}
        />
      </div>
    );
  };


  const send = () => {
    if (!message.trim() || !project?._id) return;

    const newMessage = {
      message: message,
      sender: user,
      timestamp: new Date().toISOString(),
    };

    sendMessage("project-message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    scrollToBottom();
  };


  const scrollToBottom = () => {
    if (messageBox.current) {
      setTimeout(() => {
        messageBox.current.scrollTop = messageBox.current.scrollHeight;
      }, 100);
    }
  };


  const saveFileTree = async (ft) => {
    if (!project?._id) return;

    try {
      const response = await axios.put("/projects/update-file-tree", {
        projectId: project._id,
        fileTree: ft,
      });
      console.log("File tree saved:", response.data);
    } catch (err) {
      console.error("Error saving file tree:", err);
    }
  };


  const runProject = async () => {
    if (!webContainer || !fileTree) {
      alert("WebContainer not ready. Please wait and try again.");
      return;
    }

    try {
      setIsIframeOpen(true);


      await webContainer.mount(fileTree);

      const installProcess = await webContainer.spawn("npm", ["install"]);
      installProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            console.log("Install:", chunk);
          },
        })
      );

      await installProcess.exit;


      webContainer.on("server-ready", (port, url) => {
        setIframeUrl(url);
      });


      if (runProcess) {
        runProcess.kill();
      }

      const run = await webContainer.spawn("npm", ["start"]);
      run.output.pipeTo(
        new WritableStream({
          write(chunk) {
            console.log("Run:", chunk);
          },
        })
      );

      setRunProcess(run);
    } catch (err) {
      console.error("Error running project:", err);
      alert("Failed to run project. Check console for details.");
    }
  };

  useEffect(() => {
    if (!projectId) {
      navigate("/");
      return;
    }

    let isMounted = true;

    const fetchProject = async () => {
      setIsProjectLoading(true);
      
      try {
        const res = await axios.get(`/projects/get-project/${projectId}`);
        
        if (!isMounted) return;

        const fetchedProject = res.data.project;
        
        if (!fetchedProject) {
          navigate("/");
          return;
        }

        const sortedMessages = (fetchedProject?.messages || []).sort(
          (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
        );

        setProject(fetchedProject);
        setFileTree(fetchedProject?.fileTree || {});
        setMessages(sortedMessages);
      } catch (err) {
        console.error("Error fetching project:", err);
        
        if (!isMounted) return;
        
        if (err.response?.status === 404 || err.response?.status === 403) {
          navigate("/");
        } else {
          alert("Failed to load project");
          navigate("/");
        }
      } finally {
        if (isMounted) {
          setIsProjectLoading(false);
        }
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [projectId, navigate]);

  useEffect(() => {
    if (!project?._id) return;

    if (!socketInitialized.current) {
      socketInitialized.current = true;
      initializeSocket(project._id);

      receiveMessage("project-message", (data) => {
        console.log("Received message:", data);

        if (data.sender && data.sender._id === "ai") {
          let parsedMessage;
          try {
            parsedMessage = JSON.parse(data.message);
          } catch (err) {
            parsedMessage = { text: data.message };
          }

          // Update file tree if AI sends new files
          if (parsedMessage?.fileTree) {
            const newFileTree = parsedMessage.fileTree;
            setFileTree(newFileTree);
            
            if (webContainerInitialized.current && webContainer) {
              webContainer.mount(newFileTree).catch((err) => {
                console.error("Error mounting file tree:", err);
              });
            }
          }
        }
        
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }

    if (!webContainerInitialized.current) {
      webContainerInitialized.current = true;
      
      getWebContainer()
        .then((container) => {
          setWebContainer(container);
          console.log("WebContainer initialized");
        })
        .catch((err) => {
          console.error("Error initializing WebContainer:", err);
          webContainerInitialized.current = false;
        });
    }

    if (user?._id) {
      axios
        .get(`/users/all?userId=${user._id}`)
        .then((res) => {
          setUsers(res.data.users || []);
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
        });
    }

    return () => {
      if (runProcess) {
        runProcess.kill();
      }
    };
  }, [project?._id, user?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserPopup && !e.target.closest('.user-popup-container')) {
        setShowUserPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserPopup]);

  if (isProjectLoading) {
    return (
      <main className="bg-slate-900 text-white w-screen h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-lg">Loading project...</p>
        </div>
      </main>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <main className="bg-slate-900 text-white w-screen h-screen flex overflow-hidden">
      <div className="flex h-full">
        <div
          className={`${
            isSideBarOpen ? "w-64" : "w-16"
          } bg-slate-800 transition-all duration-300 flex flex-col border-r border-slate-700`}
        >
          <div className="p-2">
            <button
              className="w-12 h-12 flex items-center justify-center text-white text-2xl hover:bg-slate-700 rounded-lg"
              onClick={() => setIsSideBarOpen(!isSideBarOpen)}
              aria-label="Toggle sidebar"
            >
              <i className="ri-menu-line"></i>
            </button>
          </div>

          <div className="px-4 mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`w-full flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors ${
                !isSideBarOpen ? "justify-center" : ""
              }`}
            >
              <i className="ri-user-add-line text-xl"></i>
              {isSideBarOpen && <span className="text-sm font-medium">Add Collaborators</span>}
            </button>
          </div>

          {isSideBarOpen && (
            <div className="flex-1 px-4 mt-6 overflow-hidden flex flex-col">
              <h2 className="text-lg font-semibold mb-3 text-slate-300">Collaborators</h2>
              <div className="flex flex-col gap-2 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                {project.users && project.users.length > 0 ? (
                  project.users.map((collaborator) => (
                    <div
                      key={collaborator._id}
                      className="flex gap-3 items-center p-2 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <i className="ri-user-fill text-white"></i>
                      </div>
                      <h1 className="font-medium text-sm truncate">{collaborator.userName || collaborator.email}</h1>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 text-center py-4">No collaborators yet</p>
                )}
              </div>
            </div>
          )}

          <div className="p-4 mt-auto border-t border-slate-700">
            <button className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors ${!isSideBarOpen ? "justify-center" : ""}`}>
              <i className="ri-settings-3-line text-xl"></i>
              {isSideBarOpen && <span className="text-sm">Settings</span>}
            </button>
          </div>
        </div>
      </div>

      <section className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={runProject}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <i className="ri-play-fill"></i>
                Run
              </button>

              <div className="relative user-popup-container">
                <button
                  onClick={() => setShowUserPopup(!showUserPopup)}
                  className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label="User menu"
                >
                  <i className="ri-user-line text-lg"></i>
                </button>
                {showUserPopup && (
                  <div className="absolute top-14 right-0 bg-slate-800 border border-slate-700 rounded-lg w-64 shadow-2xl z-50">
                    <div className="p-6 flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <i className="ri-user-fill text-2xl text-white"></i>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-lg">{user?.userName || "User"}</p>
                        <p className="text-sm text-slate-400 mt-1">{user?.email || ""}</p>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            await axios.get("/users/logout");
                            localStorage.removeItem("token");
                            navigate("/");
                          } catch (err) {
                            console.error("Logout failed:", err);
                            localStorage.removeItem("token");
                            navigate("/");
                          }
                        }}
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 rounded-lg w-full py-2 text-white font-medium transition-colors"
                      >
                        <i className="ri-logout-box-r-line"></i>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-96 flex flex-col border-r border-slate-700 bg-slate-800">
            <div
              ref={messageBox}
              className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
            >
              {messages.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <i className="ri-chat-3-line text-4xl mb-3 block"></i>
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              )}

              {messages.map((msg, index) => {
                const sender = msg.sender || {};
                const isAi = sender._id === "ai";
                const isSelf = sender._id && user?._id && sender._id.toString() === user._id.toString();
                const displayName = isAi ? "AI Assistant" : (sender.userName || sender.email || "Unknown");

                return (
                  <div
                    key={`${msg.timestamp}-${index}`}
                    className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`${
                        isAi ? "max-w-[90%]" : "max-w-[75%]"
                      } ${
                        isSelf ? "bg-blue-600" : "bg-slate-700"
                      } rounded-lg p-3 shadow-md`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {isAi ? (
                          <i className="ri-robot-2-fill text-green-400 text-sm"></i>
                        ) : (
                          <i className="ri-user-line text-blue-400 text-sm"></i>
                        )}
                        <span className="text-xs font-medium opacity-90">{displayName}</span>
                        {msg.timestamp && (
                          <span className="text-[10px] opacity-60 ml-auto">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        {isAi ? aiMessage(msg.message) : <p className="leading-relaxed break-words">{msg.message}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-400 transition-all"
                  type="text"
                  placeholder="Type your message..."
                />
                <button
                  onClick={send}
                  disabled={!message.trim()}
                  className="px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <i className="ri-send-plane-fill"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="w-64 bg-slate-800 border-r border-slate-700 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">Files</h3>
                <div className="space-y-1">
                  {Object.keys(fileTree || {}).length > 0 ? (
                    Object.keys(fileTree).map((file, index) => (
                      <button
                        key={`${file}-${index}`}
                        onClick={() => {
                          if (file !== currentFile) {
                            setCurrentFile(file);
                            setOpenFiles([...new Set([...openFiles, file])]);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          currentFile === file
                            ? "bg-blue-600 text-white"
                            : "hover:bg-slate-700 text-slate-300"
                        }`}
                      >
                        <i className="ri-file-code-line text-sm"></i>
                        <span className="text-sm truncate">{file}</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-4">No files yet</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 bg-slate-900 overflow-hidden">
              {currentFile &&
              fileTree[currentFile] &&
              fileTree[currentFile].file &&
              fileTree[currentFile]?.file?.contents ? (
                <div className="h-full flex flex-col">
                  <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                    <span className="text-sm font-medium">{currentFile}</span>
                    <button
                      onClick={() => {
                        setCurrentFile(null);
                        setOpenFiles(openFiles.filter(f => f !== currentFile));
                      }}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto p-4">
                    <pre className="hljs h-full">
                      <HighlightedCode
                        className="lang-javascript h-full outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const updatedContent = e.target.innerText;
                          const ft = {
                            ...fileTree,
                            [currentFile]: {
                              file: {
                                contents: updatedContent,
                              },
                            },
                          };
                          setFileTree(ft);
                          saveFileTree(ft);
                        }}
                      >
                        {fileTree[currentFile]?.file?.contents || ""}
                      </HighlightedCode>
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <i className="ri-file-code-line text-5xl mb-3 block"></i>
                    <p>No files to view</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {iframeUrl && webContainer && isIframeOpen && (
          <div className="absolute inset-0 bg-slate-900 z-50 flex flex-col">
            <div className="bg-slate-800 border-b border-slate-700 p-3 flex items-center gap-3">
              <button
                onClick={() => {
                  setIsIframeOpen(false);
                  if (runProcess) {
                    runProcess.kill();
                    setRunProcess(null);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <i className="ri-close-line"></i>
                Close Preview
              </button>
              <input
                type="text"
                value={iframeUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg outline-none text-white"
              />
            </div>
            <iframe 
              src={iframeUrl} 
              className="flex-1 w-full bg-white"
              title="Project Preview"
            ></iframe>
          </div>
        )}
      </section>


      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-xl w-full max-w-md mx-4 shadow-2xl border border-slate-700">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold">Add Collaborators</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedUserId(new Set());
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
              <div className="space-y-2">
                {users.length > 0 ? (
                  users.map((u) => (
                    <div
                      key={u._id}
                      onClick={() => handleUserClick(u._id)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        selectedUserId.has(u._id)
                          ? "bg-blue-600 shadow-md"
                          : "bg-slate-700 hover:bg-slate-600"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <i className="ri-user-fill text-white"></i>
                      </div>
                      <span className="font-medium flex-1">{u.userName || u.email}</span>
                      {selectedUserId.has(u._id) && (
                        <i className="ri-check-line text-xl"></i>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-400 py-4">No users available</p>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-slate-700">
              <button
                onClick={addCollaborators}
                disabled={selectedUserId.size === 0}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Add {selectedUserId.size > 0 ? `(${selectedUserId.size})` : ""} Collaborator{selectedUserId.size !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Projectdetails;