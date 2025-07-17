// resources/js/Pages/Reports/AttendanceReport.tsx
import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button, Table, Select, DatePicker, Space, Card, Row, Col, Typography } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AttendanceFilters } from '@/types/attendance';
import { AttendanceRecord } from '@/types/attendance';
import { Employee } from '@/types/employee';

const { RangePicker } = DatePicker;
const { Title } = Typography;

interface AttendanceReportProps extends PageProps {
  attendance: {
    data: AttendanceRecord[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  employees: Employee[];
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
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    router.get(route('reports.attendance'), filters, {
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

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
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
    },
  ];

  return (
    <>
      <Head title="Reporte de Asistencia" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                rowKey="id"
                pagination={{
                  current: attendance.current_page,
                  total: attendance.total,
                  pageSize: attendance.per_page,

                  onChange: (page) => {
                    setFilters(prev => ({ ...prev, page }));
                    handleSearch();
                  },
                }}
                loading={loading}
                scroll={{ x: true }}
              />
            </Space>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AttendanceReport;