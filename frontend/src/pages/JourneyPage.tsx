// Import global application context for student journey + messages
import { useApp } from '../context/AppContext';
// Icons used for journey steps and messaging UI
import { CheckCircle, Circle, MessageSquare, Send } from 'lucide-react';
// Date formatting helper for message timestamps
import { format } from 'date-fns';
// Local state hook for managing the input message
import { useState } from 'react';

// Page that shows the student's journey steps and messaging area
const JourneyPage = () => {
  // Get current student, message list and helper to send a new message
  const { student, messages, addMessage } = useApp();
  // Local state for the text in the "new message" input field
  const [newMessage, setNewMessage] = useState('');

  // If student data isn't loaded yet, show a loading spinner
  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading journey...</p>
        </div>
      </div>
    );
  }

  // Ordered list of journey steps the student goes through
  const journeySteps = [
    { id: 'profile', label: 'Profile', description: 'Complete your profile' },
    { id: 'matching', label: 'Matching', description: 'Get matched with companies' },
    { id: 'internship', label: 'Internship', description: 'Start your internship' },
    { id: 'integration', label: 'Integration', description: 'On-site integration support' },
  ];

  // Find the index of the current step based on student.journeyStatus
  const currentStepIndex = journeySteps.findIndex(step => step.id === student.journeyStatus);
  // Convenience reference to the current step object
  const currentStep = journeySteps[currentStepIndex];

  // Handle sending a message from the student to the advisor team
  const handleSendMessage = (e: React.FormEvent) => {
    // Prevent default form submit behavior
    e.preventDefault();
    // Ignore empty messages (just whitespace)
    if (!newMessage.trim()) return;

    // Build a new message payload and delegate to context
    addMessage({
      senderId: student.id,
      senderName: `${student.firstName} ${student.lastName}`,
      recipientId: 'advisor-1',
      recipientName: 'Advisor Team',
      content: newMessage,
      read: false,
    });

    // Clear the input after sending
    setNewMessage('');
  };

  // Count messages that are unread for the current student (received messages)
  const unreadCount = messages.filter(m => !m.read && m.recipientId === student.id).length;

  return (
    // Main page container for journey and messages
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Page header */}
      <div className="section-header">
        <h1 className="section-title">My Journey</h1>
        <p className="section-subtitle">Track your progress and communicate with your advisors</p>
      </div>

      {/* Journey Steps: visual timeline of where the student is in the process */}
      <div className="card-elevated mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Journey Progress</h2>

        {/* Mobile: vertical timeline for better readability */}
        <div className="space-y-4 md:hidden">
          {journeySteps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-start space-x-3 p-4 rounded-xl border transition-colors ${
                  isCurrent
                    ? 'bg-primary-50 border-primary-300'
                    : isCompleted
                    ? 'bg-white border-emerald-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="mt-1">
                  {isCompleted ? (
                    <CheckCircle className="text-emerald-600" size={24} />
                  ) : (
                    <Circle
                      className={isCurrent ? 'text-primary-600' : 'text-gray-300'}
                      size={24}
                      fill={isCurrent ? 'currentColor' : 'none'}
                    />
                  )}
                </div>
                <div>
                  <h3
                    className={`font-semibold ${
                      isCurrent ? 'text-primary-700' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop / tablet: horizontal timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Progress line behind the step icons */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 rounded-full">
              <div
                className="h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${(currentStepIndex / (journeySteps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Individual step cards laid out horizontally */}
            <div className="relative flex justify-between">
              {journeySteps.map((step, index) => {
                const isCompleted = index < currentStepIndex; // step already passed
                const isCurrent = index === currentStepIndex; // current active step

                return (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all shadow-md ${
                        isCompleted
                          ? 'bg-gradient-to-br from-primary-600 to-primary-700 border-primary-700 text-white'
                          : isCurrent
                          ? 'bg-gradient-to-br from-primary-50 to-primary-100 border-primary-600 text-primary-700 scale-110'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        // Completed steps show a filled checkmark
                        <CheckCircle size={28} />
                      ) : (
                        // Current and upcoming steps show a circle icon
                        <Circle size={28} fill={isCurrent ? 'currentColor' : 'none'} />
                      )}
                    </div>
                    <div className="mt-6 text-center">
                      <h3
                        className={`font-bold text-lg ${
                          isCurrent ? 'text-primary-700' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Status banner summarizing the current journey phase */}
        <div className="mt-10 p-5 bg-gradient-to-r from-primary-50 to-primary-100/50 border-2 border-primary-200 rounded-xl shadow-sm">
          <p className="text-sm text-primary-900 font-medium">
            <span className="font-bold">Current Status:</span> You are in the{' '}
            <span className="font-bold text-primary-700">{currentStep?.label}</span> phase
          </p>
        </div>
      </div>

      {/* Messaging section: conversation history and input to send new messages */}
      <div className="card-elevated">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          {unreadCount > 0 && (
            <span className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full text-sm font-bold shadow-md">
              {unreadCount} unread
            </span>
          )}
        </div>

        {/* Scrollable list of past messages */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="mx-auto mb-2 text-gray-400" size={32} />
              <p>No messages yet</p>
            </div>
          ) : (
            messages.map((message) => {
              // Determine if message is from the student or advisor
              const isFromStudent = message.senderId === student.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isFromStudent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md rounded-2xl p-4 shadow-md ${
                      isFromStudent
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                        : 'bg-white text-gray-900 border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{message.senderName}</span>
                      <span
                        className={`text-xs ${
                          isFromStudent ? 'text-primary-100' : 'text-gray-500'
                        }`}
                      >
                        {format(message.timestamp, 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input area for composing and sending a new message */}
        <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 input-field"
          />
          <button type="submit" className="btn-primary flex items-center justify-center space-x-2">
            <Send size={18} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default JourneyPage;
