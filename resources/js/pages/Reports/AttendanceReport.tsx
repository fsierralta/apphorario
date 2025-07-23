// resources/js/Pages/Reports/AttendanceReport.tsx
import  { useState  } from 'react';
import { Head,  router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button, Table, Select, DatePicker, Space, Card, Row, Col, Typography, Modal } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AttendanceFilters } from '@/types/attendance';
import { AttendanceRecord } from '@/types/attendance';
import { Employee } from '@/types/employee';

import AppLayout from "@/layouts/app-layout";
import { toast,ToastContainer } from 'react-toastify';

const { RangePicker } = DatePicker;
const { Title } = Typography;

interface AttendanceReportProps extends PageProps {
  attendance: {
    data: AttendanceRecord[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;

  };
  employees: Employee[];
}

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
  }>;
}

const AttendanceReport: React.FC<AttendanceReportProps> = ({ attendance, employees }) => {
  const { filters: initialFilters } = usePage().props;
  const [filters, setFilters] = useState<AttendanceFilters>({
    ...{
        fechai: undefined,
        fechaf: undefined,
        empleado_id: undefined,
        tipo: undefined,
        page: 1
    },
    ...(initialFilters || {})
});
 console.log(attendance)
  const [loading, setLoading] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [scheduleDetails, setScheduleDetails] = useState<ScheduleDetails | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const fetchScheduleDetails = async (scheduleId: number) => {
    try {
      setScheduleLoading(true);
      const response = await fetch(route('api.schedules.show', scheduleId));
      if (!response.ok) throw new Error('Error al cargar el horario');
      const data = await response.json();
      setScheduleDetails(data);
      setScheduleModalVisible(true);
     // indicar que se carga La data 
      toast.success('Horario cargado correctamente');
    } catch (error) {
      console.error('Error:', error);

      toast.error('Error al cargar el horario');       
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleScheduleClick = (scheduleId: number) => {
    fetchScheduleDetails(scheduleId);
  };

  const handleSearch = () => {
    // Resetear a la primera página al realizar una nueva búsqueda
    const searchFilters = { ...filters, page: 1 };
    setFilters(searchFilters);
    router.get(route('reports.attendance'), searchFilters, {
      preserveState: true,
      onStart: () => setLoading(true),
      onFinish: () => setLoading(false),
    });
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    router.get(route('reports.attendance'), newFilters, {
     // preserveState: true,
      onStart: () => setLoading(true),
      onFinish: () => setLoading(false),
    });
  };

  const handleExport = () => {
    const exportUrl = route('reports.attendance', {
      ...filters,
      export: 'excel',
      _query: {
        ...filters,
      },
    });
    window.location.href = exportUrl;
  };

  const handleDateChange = (dates: unknown, dateStrings: [string, string]) => {
    setFilters(prev => ({
      ...prev,
      fechai: dateStrings[0],
      fechaf: dateStrings[1],
    }));
  };

  const columns: ColumnsType<AttendanceRecord> = [
    {
      title: 'Empleado',
      dataIndex: ['nombre', 'apellido'],
      key: 'empleado',
      render: (_, record) => `${record.nombre} ${record.apellido}`,
    },
    {
      title: 'Cédula',
      dataIndex: 'cedula',
      key: 'cedula',
    },
    {
      title: 'Cargo',
      dataIndex: 'cargo',
      key: 'cargo',
    },
    {
      title: 'Fecha',
      dataIndex: 'registro_fecha',
      key: 'fecha',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Hora Entrada',
      dataIndex: 'hora_entrada',
      key: 'hora_entrada',
      render: (text) => text || '-',
    },
    {
      title: 'Hora Salida',
      dataIndex: 'hora_salida',
      key: 'hora_salida',
      render: (text) => text || '-',
    },
    {
      title: 'Inicio Descanso',
      dataIndex: 'inicio_descanso',
      key: 'inicio_descanso',
      render: (text) => text || '-',
    },
    {
      title: 'Fin Descanso',
      dataIndex: 'fin_descanso',
      key: 'fin_descanso',
      render: (text) => text || '-',
    },
    {
      title: 'Horario',
      dataIndex: 'horario',
      key: 'horario',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleScheduleClick(record.schedule_id)}>{record.schedule_id}</a>
        </Space>
      ),
    },
  ];
 

  return (
    <>
    <AppLayout
    breadcrumbs={[
        { title: 'Reporte de Asistencia', href: route('reports.attendance') },
    ]}  
    >

      <Head title="Reporte de Asistencia" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <ToastContainer/>
          <Card>
            <Title level={4} className="mb-6">Reporte de Asistencia</Title>
            
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <RangePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    placeholder={['Fecha Inicio', 'Fecha Fin']}
                    onChange={handleDateChange}
                    value={
                      filters.fechai && filters.fechaf
                        ? [dayjs(filters.fechai), dayjs(filters.fechaf)]
                        : undefined
                    }
                  />
                </Col>
                
                <Col xs={24} sm={12} md={4}>
                  <Select
                    placeholder="Empleado"
                    style={{ width: '100%' }}
                    allowClear
                    value={filters.empleado_id}
                    onChange={(value) => setFilters(prev => ({ ...prev, empleado_id: value }))}
                    options={[
                      { value: '', label: 'Todos los empleados' },
                      ...employees.map(emp => ({
                        value: emp.id,
                        label: `${emp.nombre} ${emp.apellido}`
                      }))
                    ]}
                  />
                </Col>
                
                <Col xs={24} sm={12} md={4}>
                  <Select
                    placeholder="Tipo de registro"
                    style={{ width: '100%' }}
                    allowClear
                    value={filters.tipo}
                    onChange={(value) => setFilters(prev => ({ ...prev, tipo: value }))}
                    options={[
                      { value: '', label: 'Todos' },
                      { value: 'entrada', label: 'Entrada' },
                      { value: 'salida', label: 'Salida' },
                      { value: 'descanso', label: 'Descanso' },
                      { value: 'regreso_descanso', label: 'Fin de Descanso' },
                    ]}
                  />
                </Col>
                
                <Col xs={24} sm={12} md={10} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      onClick={handleSearch}
                      loading={loading}
                    >
                      Buscar
                    </Button>
                    <Button
                      type="default"
                      icon={<DownloadOutlined />}
                      onClick={handleExport}
                      loading={loading}
                    >
                      Exportar
                    </Button>
                  </Space>
                </Col>
              </Row>
              
              <Table
                columns={columns}
                dataSource={attendance.data}
               rowKey={(record, index) => `${record.id}-${index}`}
                pagination={{
                  current: attendance.current_page,
                  total: attendance.total,
                  pageSize: attendance.per_page,
                  onChange: handlePageChange,
                }}
                loading={loading}
                scroll={{ x: true }}
              />
            </Space>
          </Card>
        </div>
      </div>
      {/* Modal de Detalles de Horario */}
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
      </AppLayout>
    </>
  );
};

export default AttendanceReport;