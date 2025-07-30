export const dayNameInitials: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, string> = {
    1: 'L',
    2: 'M',
    3: 'X',
    4: 'J',
    5: 'V',
    6: 'S',
    7: 'D'
};

export const dayShortNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const getDayName = (day: number): string => {
    // Asumiendo que day es un número de 1 (Lunes) a 7 (Domingo)
    const names = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    // day-1 porque el array es 0-indexed
    return names[day - 1] || '';
};