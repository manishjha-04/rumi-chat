import {Fragment, useState, useEffect, useMemo, useRef} from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Input,
  Button,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import ReactMarkdown from 'react-markdown';
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
  ChatBubbleBottomCenterIcon,
  EllipsisHorizontalIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";
import './dashboard.css'
import { BACKEND_CHAT_URL, ENV_CHAT_PROXY, ENV_PROXY } from "@/configs/globalVariable";
import styles from './chat.module.css';
import gfm from 'remark-gfm';
import { MentionsInput, Mention } from 'react-mentions';
import { getVisualizationResponse } from '@/data/mockVisualizations';
import VisualizationRenderer from '@/components/visualizations/VisualizationRenderer';


const JettIcon = ({ className }) => {
  return <img src="/img/logo-ct-dark.png" alt="Bot Icon" className={className} />;
};

const UserIcon = ({ className }) => {
  return <img src="/img/user-icon.svg" alt="User Icon" className={className} />;
};


function ChatBox() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTildePresent, setIsTildePresent] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [partialQuery, setPartialQuery] = useState("");
  const [nameToIdMap, setNameToIdMap] = useState(new Map());

  // Sample responses for local testing
  const sampleResponses = [
    "I can help you with that! Here's what you need to know...",
    "That's an interesting question. Let me explain...",
    "Based on your question, I would recommend...",
    "Here's a detailed explanation of what you're asking about..."
  ];

  const [messageState, setMessageState] = useState({
    messages: [
      {
        message: 'Hi, what would you like to ask me?',
        type: 'bot',
      },
    ],
    history: [],
    pending: undefined,
    sourceDocuments: []
  });

  async function handleSubmit(e) {
    e.preventDefault();

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();

    // Add user message
    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'you',
          message: question,
        },
      ],
    }));

    setLoading(true);
    setQuery('');

    // Check for visualization response
    const visualizationResponse = getVisualizationResponse(question);
    
    if (visualizationResponse) {
      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'bot',
            message: visualizationResponse.message,
            visualization: visualizationResponse.visualization
          },
        ]
      }));
    } else {
      // Fallback to sample responses
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'bot',
            message: randomResponse,
          },
        ]
      }));
    }
    
    setLoading(false);
  }

  //prevent empty submissions
  const handleEnter = (e) => {
    if (isTildePresent) {
      return;
    }
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  const { messages, pending, history, sourceDocuments=[] } = messageState;
  const [open, setOpen] = useState(-1);
  const showSource = true;

  const handleOpen = (value) => {
    setOpen(open === value ? -1 : value);
  };
  const chatMessages = useMemo(() => {
    return [...messages];
  }, [messages]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const searchApi = async (query) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${ENV_PROXY}/v1/autocomplete/?query=`+query, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        return [];
      }
      const res = await response.json();
      return res.map(result => ({ id: result.id, display: result.name }));
    } catch(e) {
      return [];
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, sourceDocuments]);
  console.log("sourceDocuments", sourceDocuments, showSource)

  const handleInput = (e) => {
    const value = e.target.value;
    setQuery(value);
  
    if (value.includes("~")) {
      const afterTilde = value.split("~").pop();
      setIsTildePresent(true);
      setPartialQuery(afterTilde);
    } else {
      setIsTildePresent(false);
    }
  }

  const handleSelect = (id) => {
    const selectedResult = autocompleteResults.find(m => m.id === id); 
    const parts = query.split("~");
    parts.pop();
    parts.push("`" + selectedResult.display + "`");
    setQuery(parts.join(" "));
    setNameToIdMap(prevMap => new Map(prevMap.set(selectedResult.display, selectedResult.id)));
    setAutocompleteResults([]);
    setIsTildePresent(false);
  }
  
  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {chatMessages.map((message, index) => {
          if (message.message === "") {
            return null;
          }
          
          const isBot = message.type === "bot";
          const icon = isBot ? <JettIcon className={styles.avatar} /> : <UserIcon className={styles.avatar} />;
          
          return (
            <div key={`chatMessage-${index}`} className={styles.messageWrapper}>
              <div className="flex items-start">
                {isBot && icon}
                <div className={`${styles.message} ${isBot ? styles.botMessage : styles.userMessage}`}>
                  <ReactMarkdown remarkPlugins={[gfm]} linkTarget="_blank">
                    {message.message}
                  </ReactMarkdown>
                  {message.visualization && (
                    <div className="mt-3">
                      <VisualizationRenderer content={message.visualization} />
                    </div>
                  )}
                </div>
                {!isBot && icon}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Type your message..."
            value={query}
            onChange={handleInput}
            onKeyDown={handleEnter}
            className={styles.chatInput}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className={styles.sendButton}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export function Chat() {
  return (
    <>
      <div className="h-12 w-full"></div>
      
    <div className="relative mt-2 h-[calc(100vh-8rem)] w-full">
      {/* <div className="h-[calc(60vh-48px)] sm:h-[calc(50vh-48px)] md:h-[calc(70vh-48px)] lg:h-[calc(90vh-48px)] xl:h-[calc(95vh-48px)] flex flex-col"> */}
        <Card className="flex flex-col h-full w-full">
          <CardBody className="flex-1 flex flex-col overflow-y-auto">
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Chat with us
            </Typography>
            <div className="flex-1 overflow-y-auto">
            <ChatBox />
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}


export default Chat;
