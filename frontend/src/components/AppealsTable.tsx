import { useMemo, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { useCreateAppealMutation, useGetAppealsQuery } from '../redux/features/appealsSlice/appealApiSlice';
import { useAddAppealTopicMutation, useGetAppealTopicsQuery } from '../redux/features/appealTopics/appealTopicsApiSlice';

const AppealsTable = () => {
  const navigate = useNavigate();
  const { data: appealsData, isError, isLoading, isSuccess } = useGetAppealsQuery();
  const { data: appealTopicsData } = useGetAppealTopicsQuery();
  const [addTopic] = useAddAppealTopicMutation();
  const [addAppeal] = useCreateAppealMutation();

  const [isAddMode, setIsAddMode] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [formData, setFormData] = useState<{message: string, topicId: number | null}>({ message: '', topicId: null });

  const appeals = useMemo(() => appealsData && Array.isArray(appealsData) ? appealsData : null, [appealsData]);
  const appealTopics = useMemo(() => appealTopicsData && Array.isArray(appealTopicsData) ? appealTopicsData : null, [appealTopicsData]);

  const handleRowClick = (id: number) => {
    navigate(`/appeals/${id}`);
  };

  const addAppealTopicFunction = async () => {
    if (newTopic.length === 0) {
      throw new Error('Тема пуста');
    }
    await addTopic({ appealTopicName: newTopic });
    setNewTopic('');
  };

  const submitForm = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!formData.message.trim()) {
        throw new Error('Сообщение пустое');
      }
      if (!formData.topicId) {
        throw new Error('Тема не указана');
      }
      await addAppeal({topicId: formData.topicId, message: formData.message})
    } catch (error: any) {
      console.error(error.message);
    }
  };

  if (isLoading) return <div>Загрузка обращений...</div>;
  if (isError) return <div>Ошибка: {isError}</div>;

  return (
    <div>
      <h2>Список обращений</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Тема</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {isSuccess && appeals && appeals.length > 0 ? appeals.map((appeal) => (
            <tr key={appeal.appealId} onClick={() => handleRowClick(appeal.appealId)}>
              <td>{appeal.appealId}</td>
              <td>{appeal.AppealTopic?.appealTopicName || '—'}</td>
              <td>{appeal.AppealStatus?.appealStatusDesc || '—'}</td>
            </tr>
          )) : <tr><td colSpan={3}>Данные не найдены</td></tr>}
        </tbody>
      </table>
      {isAddMode ? (
        <form onSubmit={submitForm}>
          <input type="text" placeholder="Текст обращения" onChange={(e) => {
            setFormData((old) => ({
              ...old,
              message: e.target.value
            }))
          }} />
          Тема обращения:
          <select onChange={(e) => {
            setFormData((old) => ({
              ...old,
              topicId: Number(e.target.value)
            }))
          }}>
            {appealTopics && appealTopics.map((item) => (
              <option key={item.appealTopicId} value={item.appealTopicId}>
                {item.appealTopicName}
              </option>
            ))}
          </select>
          Нет темы в списке?
          <input
            type="text"
            placeholder="Введите тему"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
          />
          <button onClick={addAppealTopicFunction}>Добавить тему</button>
          <button type="submit">Создать обращение</button>
        </form>
      ) : (
        <button onClick={() => setIsAddMode(true)}>Создать обращение</button>
      )}
    </div>
  );
};

export default AppealsTable;