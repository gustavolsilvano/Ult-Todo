const getMili = ( time, met ) => {
        switch (met) {
            case 'half':
                return time.getHours() * 60 * 60 * 1000 + time.getMinutes() * 60 * 1000;
            case 'all':
                return time.getHours() * 60 * 60 * 1000 + time.getMinutes() * 60 * 1000 + time.getSeconds() * 1000 + time.getMilliseconds();
            default:
                break;
        }
        
};

export default getMili;