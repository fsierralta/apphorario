 
 import React from 'react'
 import { Modal, Button, Table } from 'antd';
 
 interface ScheduleDetails {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  days: Array<{
    day: string;
    is_working_day: boolean;
    start_time: string;
    end_time: string;
    break_start?: string;
    break_end?: string;
  }>
}
 interface ScheduleDetailsProps {
  scheduleModalVisible: boolean;
  setScheduleModalVisible: (visible: boolean) => void;
  scheduleDetails: ScheduleDetails | null ;   // Puede ser null o undefined si no hay detalles 
  scheduleLoading: boolean;
}
 function ScheduleDetails({scheduleModalVisible,
     setScheduleModalVisible, 
     scheduleDetails, scheduleLoading}:ScheduleDetailsProps) {
   return (
     <div>ScheduleDetails
            <Modal
        title={`Detalles del Horario ${scheduleDetails?.name || ''}`}
        open={scheduleModalVisible}
        onCancel={() => setScheduleModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setScheduleModalVisible(false)}>
            Cerrar
          </Button>,
        ]}
        width={800}
      >
        {scheduleLoading ? (
          <div className="text-center p-4">Cargando detalles del horario...</div>
        ) : scheduleDetails ? (
          <div>
            <div className="mb-4">
              <p><strong>Horario:</strong> {scheduleDetails.start_time} - {scheduleDetails.end_time}</p>
            </div>
            <Table 
              dataSource={scheduleDetails.days}
              rowKey="day"
              pagination={false}
              columns={[
                {
                  title: 'Día',
                  dataIndex: 'day',
                  key: 'day',
                  render: (day) => {
                    const daysMap: Record<string, string> = {
                      monday: 'Lunes',
                      tuesday: 'Martes',
                      wednesday: 'Miércoles',
                      thursday: 'Jueves',
                      friday: 'Viernes',
                      saturday: 'Sábado',
                      sunday: 'Domingo'
                    };
                    return daysMap[day] || day;
                  }
                },
                {
                  title: 'Día Laboral',
                  dataIndex: 'is_working_day',
                  key: 'is_working_day',
                  render: (isWorking) => isWorking ? 'Sí' : 'No'
                },
                {
                  title: 'Hora Inicio',
                  dataIndex: 'start_time',
                  key: 'start_time',
                  render: (time) => time || '-'
                },
                {
                  title: 'Hora Fin',
                  dataIndex: 'end_time',
                  key: 'end_time',
                  render: (time) => time || '-'
                },
                {
                  title: 'Descanso',
                  key: 'break',
                  render: (_, record) => 
                    record.break_start && record.break_end 
                      ? `${record.break_start} - ${record.break_end}` 
                      : 'Sin descanso'
                }
              ]}
            />
          </div>
        ) : (
          <div>No se encontraron detalles del horario</div>
        )}
      </Modal>

     </div>
   )
 }
 
 export default ScheduleDetails