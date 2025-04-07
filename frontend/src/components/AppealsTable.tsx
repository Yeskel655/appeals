import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAppealsQuery } from '../redux/features/appealsSlice/appealApiSlice';

const AppealsTable = () => {
  const navigate = useNavigate();
  const { data: appealsData, isError, isLoading, isSuccess } = useGetAppealsQuery();

  const appeals = useMemo(
    () =>
      appealsData && Array.isArray(appealsData)
        ? appealsData
        : null,
    [appealsData]
  );

  const handleRowClick = (id: number) => {
    navigate(`/appeals/${id}`);
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
          {isSuccess && appeals && appeals?.length > 0 ? appeals.map((appeal) => (
            <tr
              key={appeal.appealId}
              onClick={() => handleRowClick(appeal.appealId)}
            >
              <td>{appeal.appealId}</td>
              <td>{appeal.AppealTopic.appealTopicName || '—'}</td>
              <td>{appeal.AppealStatus?.appealStatusDesc || '—'}</td>
            </tr>
          )) : ''}
        </tbody>
      </table>
    </div>
  );
};

export default AppealsTable;
