import React from 'react';

const ShimmerMessages = () => {
  return (
    <>
      {[...Array(6)].map((_, idx) => (
        <div
          key={idx}
          className={`chat ${idx % 2 === 0 ? 'chat-start' : 'chat-end'} mb-4 animate-pulse`}
        >
          <div>
            <div className="chat-message h-4 bg-gray-300 rounded w-24 mb-1"></div>
            <div className="chat-bubble bg-gray-300 p-2 rounded-lg w-40 h-4"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ShimmerMessages;