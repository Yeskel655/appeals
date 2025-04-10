import { useEffect, useMemo, useState } from "react";
import { useGetAppealDetailsQuery, useSetCancelStatusMutation, useSetCompleteStatusMutation, useSetWorkStatusMutation } from "../redux/features/appealDetailsSlice/appealDetailsApiSlice";
import { useParams } from "react-router-dom";
import { useGetAppealStatusesQuery } from "../redux/features/appealStatusesSlice/appealStatusesApiSlice";

const AppealDetails = () => {
  const { id } = useParams(); // <-- получаем id из URL-пути
  if (!id) {
    return <div>Не указан id обращения</div>;
  }
  const numericId = parseInt(id, 10);

  const [formData, setFormData] = useState<{ statusId: number | null, message: string | null }>({ message: null, statusId: null });

  const {
    data: appealDetailData,
    isError,
    isLoading,
  } = useGetAppealDetailsQuery({ id: numericId });


  const { data: statusesData } = useGetAppealStatusesQuery()

  const [setWorkStatus] = useSetWorkStatusMutation();
  const [setCancelStatus] = useSetCancelStatusMutation();
  const [setCompleteStatus] = useSetCompleteStatusMutation();


  const statuses = useMemo(
    () => (statusesData ? statusesData : null),
    [statusesData]
  );

  const appealDetail = useMemo(
    () => (appealDetailData ? appealDetailData : null),
    [appealDetailData]
  );

  const updateStatusAppeal = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const statusCypher = statuses?.find((el) => el.appealStatusId === formData.statusId)
      if (!statusCypher) {
        throw new Error('Не указан statusCypher')
      }
      if (!formData.message) {
        throw new Error('Сообщение пустое');
      }
      switch (statusCypher.appealStatusCypher) {
        case 'WORK':
          await setWorkStatus({ id: Number(id)})
          break;
        case 'CANCELLED':
          await setCancelStatus({ id: Number(id), message: formData.message })
          break;
        case 'COMPLETED':
          await setCompleteStatus({ id: Number(id), message: formData.message })
          break;
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка загрузки</div>;
  if (!appealDetail) return <div>Данные не найдены</div>;

  return (
    <><table>
      <thead>
        <tr>
          <td>№</td>
          <td>Тема</td>
          <td>Статус</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{appealDetail.appealId}</td>
          <td>{appealDetail.AppealTopic?.appealTopicName}</td>
          <td>{appealDetail.AppealStatus?.appealStatusDesc}</td>
        </tr>
        <tr>
          <td colSpan={3}>Текст обращения</td>
        </tr>
        <tr>
          <td colSpan={3}>{appealDetail.AppealMessage?.appealMessage}</td>
        </tr>
      </tbody>
    </table>
      <form onSubmit={updateStatusAppeal}>
        <input type="text" onChange={(e)=>{
          setFormData((old) => ({
            ...old,
            message: e.target.value
          }))
        }}></input>
        <select onChange={(e) => {
          setFormData((old) => ({
            ...old,
            statusId: Number(e.target.value)
          }))
        }} >
          {statuses && statuses.map((item, index) => (
            <option key={index} value={item.appealStatusId}>
              {item.appealStatusDesc}
            </option>
          ))
          }
        </select>
        <button type="submit">Изменить Статус</button>
      </form ></>
  );
};

export default AppealDetails;
