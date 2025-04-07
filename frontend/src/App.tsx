import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [topicId, setTopicId] = useState(1);

  const createAppeal = async () => {
    const res = await axios.post('http://localhost:3001/appeals', {
      topicId,
      message,
    });
    alert('Created appeal #' + res.data.appeal_id);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-2">Создание обращения</h1>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="border w-full mb-2" />
      <input
        type="number"
        value={topicId}
        onChange={(e) => setTopicId(Number(e.target.value))}
        className="border w-full mb-2"
      />
      <button onClick={createAppeal} className="bg-blue-500 text-white px-4 py-2 rounded">
        Отправить обращение
      </button>
    </div>
  );
}

export default App;