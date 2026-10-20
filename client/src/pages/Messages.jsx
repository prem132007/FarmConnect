import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import "../css/Messages.css";

function Messages() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [unreadCounts, setUnreadCounts] = useState({});
    const [onlineUsers, setOnlineUsers] = useState([]);

    const messagesEndRef = useRef(null);
    const selectedUserRef = useRef(null);

    // =====================================================
    // KEEP SELECTED USER REF UPDATED
    // =====================================================

    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    // =====================================================
    // LOAD CHAT USERS
    // =====================================================

    useEffect(() => {
        const fetchChatUsers = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please login to use messages.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/messages/users",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load chat users."
                    );
                }

                setUsers(data.users || []);
                setUnreadCounts(data.unreadCounts || {});
            } catch (error) {
                console.error("Chat Users Error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChatUsers();
    }, []);

    // =====================================================
    // LOAD CONVERSATION
    // =====================================================

    useEffect(() => {
        const fetchConversation = async () => {
            if (!selectedUser) {
                setMessages([]);
                return;
            }

            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:5000/api/messages/${selectedUser._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load conversation."
                    );
                }

                setMessages(data.messages || []);

                // Mark unread messages as read visually
                setUnreadCounts((previousCounts) => ({
                    ...previousCounts,
                    [selectedUser._id]: 0,
                }));
            } catch (error) {
                console.error("Conversation Error:", error);
            }
        };

        fetchConversation();
    }, [selectedUser]);

    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const handleSendMessage = async () => {
        if (!selectedUser || !newMessage.trim()) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/messages",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        receiverId: selectedUser._id,
                        message: newMessage.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to send message."
                );
            }

            setMessages((previousMessages) => [
                ...previousMessages,
                data.data,
            ]);

            setNewMessage("");
        } catch (error) {
            console.error("Send Message Error:", error);
        }
    };

    // =====================================================
    // SOCKET.IO
    // =====================================================

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        let user;

        try {
            user = JSON.parse(localStorage.getItem("user"));
        } catch (error) {
            console.error("User Parse Error:", error);
            return;
        }

        if (!user?.id) {
            return;
        }

        const handleConnect = () => {
            console.log(
                "SOCKET CONNECTED SUCCESSFULLY:",
                socket.connected
            );

            console.log("SOCKET ID:", socket.id);

            socket.emit("join", user.id);

            console.log("SOCKET USER ID:", user.id);
        };

        const handleConnectError = (error) => {
            console.error(
                "SOCKET CONNECTION ERROR:",
                error.message
            );
        };

        const handleDisconnect = (reason) => {
            console.log("SOCKET DISCONNECTED:", reason);
        };

        const handleUserOnline = (userId) => {
            setOnlineUsers((previousUsers) => {
                if (previousUsers.includes(userId)) {
                    return previousUsers;
                }

                return [...previousUsers, userId];
            });
        };

        const handleUserOffline = (userId) => {
            setOnlineUsers((previousUsers) =>
                previousUsers.filter((id) => id !== userId)
            );
        };

        const handleNewMessage = (message) => {
            console.log("NEW MESSAGE RECEIVED:", message);

            const currentUser = JSON.parse(
                localStorage.getItem("user")
            );

            if (!currentUser?.id) {
                return;
            }

            const senderId = message.sender?._id;

            // Don't duplicate own sent message
            if (senderId === currentUser.id) {
                return;
            }

            const currentSelectedUser =
                selectedUserRef.current;

            const isMessageFromSelectedUser =
                currentSelectedUser?._id === senderId;

            if (isMessageFromSelectedUser) {
                setMessages((previousMessages) => [
                    ...previousMessages,
                    message,
                ]);

                setUnreadCounts((previousCounts) => ({
                    ...previousCounts,
                    [senderId]: 0,
                }));

                return;
            }

            setUnreadCounts((previousCounts) => ({
                ...previousCounts,
                [senderId]:
                    (previousCounts[senderId] || 0) + 1,
            }));
        };

        const handleMessagesRead = ({ messageIds }) => {
            setMessages((previousMessages) =>
                previousMessages.map((message) =>
                    messageIds.includes(message._id)
                        ? { ...message, read: true }
                        : message
                )
            );
        };

        socket.on("connect", handleConnect);
        socket.on("connect_error", handleConnectError);
        socket.on("disconnect", handleDisconnect);
        socket.on("userOnline", handleUserOnline);
        socket.on("userOffline", handleUserOffline);
        socket.on("newMessage", handleNewMessage);
        socket.on("messagesRead", handleMessagesRead);

        if (!socket.connected) {
            socket.connect();
        } else {
            handleConnect();
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleConnectError);
            socket.off("disconnect", handleDisconnect);
            socket.off("userOnline", handleUserOnline);
            socket.off("userOffline", handleUserOffline);
            socket.off("newMessage", handleNewMessage);
            socket.off("messagesRead", handleMessagesRead);

            socket.disconnect();
        };
    }, []);

    // =====================================================
    // AUTO SCROLL
    // =====================================================

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatMessageDate = (date) => {
        const messageDate = new Date(date);
        const today = new Date();

        if (
            messageDate.toDateString() ===
            today.toDateString()
        ) {
            return "Today";
        }

        return messageDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // =====================================================
    // CURRENT USER
    // =====================================================

    const getCurrentUserId = () => {
        try {
            const user = JSON.parse(
                localStorage.getItem("user")
            );

            return user?.id;
        } catch {
            return null;
        }
    };

    const currentUserId = getCurrentUserId();

    // =====================================================
    // BACK BUTTON
    // =====================================================

    const handleBack = () => {
        navigate(-1);
    };

    // =====================================================
    // HOME BUTTON
    // =====================================================

    const handleHome = () => {
        navigate("/");
    };

    // =====================================================
    // RETURN
    // =====================================================

    return (
        <div className="messages-page">

            {/* =================================================
                TOP NAVIGATION
            ================================================= */}

            <div className="messages-top-bar">

                <div className="messages-navigation">

                    <button
                        type="button"
                        className="messages-nav-button back-button"
                        onClick={handleBack}
                    >
                        ← Back
                    </button>

                    <button
                        type="button"
                        className="messages-nav-button home-button"
                        onClick={handleHome}
                    >
                        🏠 Home
                    </button>

                </div>

                <h1 className="messages-title">
                    💬 Messages
                </h1>

            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
                <div className="messages-status">
                    <p>Loading users...</p>
                </div>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="messages-error">
                    <p>{error}</p>
                </div>
            )}

            {/* =================================================
                NO USERS
            ================================================= */}

            {!loading &&
                !error &&
                users.length === 0 && (
                    <div className="messages-empty">
                        <div className="messages-empty-icon">
                            💬
                        </div>

                        <h2>
                            No users available for chat
                        </h2>

                        <p>
                            There are currently no users available
                            to start a conversation.
                        </p>

                        <button
                            type="button"
                            className="messages-home-empty-button"
                            onClick={handleHome}
                        >
                            🏠 Go to Home
                        </button>
                    </div>
                )}

            {/* =================================================
                CHAT
            ================================================= */}

            {!loading &&
                !error &&
                users.length > 0 && (

                    <div className="chat-container">

                        {/* =================================================
                            USERS
                        ================================================= */}

                        <div className="chat-users">

                            <div className="chat-users-header">
                                <h3 className="chat-users-title">
                                    Chat Users
                                </h3>

                                <span className="chat-users-count">
                                    {users.length}
                                </span>
                            </div>

                            {users.map((user) => (

                                <div
                                    key={user._id}
                                    onClick={() => {
                                        setSelectedUser(user);

                                        setUnreadCounts(
                                            (previousCounts) => ({
                                                ...previousCounts,
                                                [user._id]: 0,
                                            })
                                        );
                                    }}
                                    className={`chat-user ${selectedUser?._id ===
                                            user._id
                                            ? "selected"
                                            : ""
                                        }`}
                                >

                                    <div className="chat-user-name-row">

                                        <h3 className="chat-user-name">
                                            {user.name}
                                        </h3>

                                        {unreadCounts[user._id] >
                                            0 && (
                                                <span className="unread-count">
                                                    {
                                                        unreadCounts[
                                                        user._id
                                                        ]
                                                    }
                                                </span>
                                            )}

                                    </div>

                                    <p className="chat-user-email">
                                        {user.email}
                                    </p>

                                    <p className="chat-user-role">
                                        {user.role}
                                    </p>

                                    <p className="chat-user-status">

                                        <span
                                            className={
                                                onlineUsers.includes(
                                                    user._id
                                                )
                                                    ? "status-dot online"
                                                    : "status-dot offline"
                                            }
                                        ></span>

                                        {onlineUsers.includes(
                                            user._id
                                        )
                                            ? "Online"
                                            : "Offline"}

                                    </p>

                                </div>

                            ))}

                        </div>

                        {/* =================================================
                            CHAT WINDOW
                        ================================================= */}

                        <div className="chat-window">

                            {selectedUser ? (

                                <>

                                    {/* CHAT HEADER */}

                                    <div className="chat-header">

                                        <div>

                                            <h2>
                                                Chat with{" "}
                                                {
                                                    selectedUser.name
                                                }
                                            </h2>

                                            <p className="chat-user-status">

                                                <span
                                                    className={
                                                        onlineUsers.includes(
                                                            selectedUser._id
                                                        )
                                                            ? "status-dot online"
                                                            : "status-dot offline"
                                                    }
                                                ></span>

                                                {onlineUsers.includes(
                                                    selectedUser._id
                                                )
                                                    ? "Online"
                                                    : "Offline"}

                                            </p>

                                        </div>

                                    </div>

                                    {/* =================================================
                                        MESSAGES
                                    ================================================= */}

                                    <div className="chat-messages">

                                        {messages.length === 0 ? (

                                            <div className="no-messages">

                                                <div>
                                                    💬
                                                </div>

                                                <h3>
                                                    No messages yet
                                                </h3>

                                                <p>
                                                    Start the conversation
                                                    by sending a message.
                                                </p>

                                            </div>

                                        ) : (

                                            <div>

                                                {messages.map(
                                                    (msg, index) => {

                                                        const currentDate =
                                                            formatMessageDate(
                                                                msg.createdAt
                                                            );

                                                        const previousDate =
                                                            index > 0
                                                                ? formatMessageDate(
                                                                    messages[
                                                                        index -
                                                                        1
                                                                    ]
                                                                        .createdAt
                                                                )
                                                                : null;

                                                        const showDateSeparator =
                                                            index === 0 ||
                                                            currentDate !==
                                                            previousDate;

                                                        const isMyMessage =
                                                            msg.sender?._id ===
                                                            currentUserId;

                                                        return (
                                                            <React.Fragment
                                                                key={
                                                                    msg._id
                                                                }
                                                            >

                                                                {showDateSeparator && (
                                                                    <div className="message-date-separator">
                                                                        {
                                                                            currentDate
                                                                        }
                                                                    </div>
                                                                )}

                                                                <div
                                                                    className={`chat-message ${isMyMessage
                                                                            ? "my-message"
                                                                            : "other-message"
                                                                        }`}
                                                                >

                                                                    <strong>
                                                                        {
                                                                            msg
                                                                                .sender
                                                                                ?.name
                                                                        }
                                                                    </strong>

                                                                    <p>
                                                                        {
                                                                            msg.message
                                                                        }
                                                                    </p>

                                                                    <span className="message-time">

                                                                        {new Date(
                                                                            msg.createdAt
                                                                        ).toLocaleTimeString(
                                                                            [],
                                                                            {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            }
                                                                        )}

                                                                        {isMyMessage && (
                                                                            <span
                                                                                className={`message-status ${msg.read
                                                                                        ? "read"
                                                                                        : "sent"
                                                                                    }`}
                                                                            >
                                                                                {msg.read
                                                                                    ? "✓✓"
                                                                                    : "✓"}
                                                                            </span>
                                                                        )}

                                                                    </span>

                                                                </div>

                                                            </React.Fragment>
                                                        );
                                                    }
                                                )}

                                            </div>
                                        )}

                                        <div
                                            ref={
                                                messagesEndRef
                                            }
                                        />

                                    </div>

                                    {/* =================================================
                                        MESSAGE INPUT
                                    ================================================= */}

                                    <div className="chat-input-area">

                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            value={
                                                newMessage
                                            }
                                            onChange={(e) =>
                                                setNewMessage(
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key ===
                                                    "Enter" &&
                                                    !e.shiftKey
                                                ) {
                                                    e.preventDefault();

                                                    handleSendMessage();
                                                }
                                            }}
                                            className="chat-input"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                handleSendMessage
                                            }
                                            className="chat-send-button"
                                        >
                                            Send
                                        </button>

                                    </div>

                                </>

                            ) : (

                                <div className="select-user-message">

                                    <div className="select-user-icon">
                                        💬
                                    </div>

                                    <h2>
                                        Select a user
                                    </h2>

                                    <p>
                                        Select a user from the list
                                        to start chatting.
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>
                )}

        </div>
    );
}

export default Messages;