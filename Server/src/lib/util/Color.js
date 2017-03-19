let debug = require('debug')('pandirc:colors');

const colors = {
    Color_Off:"\x1b[0m",
    Black:"\x1b[30m",
    Red:"\x1b[31m",
    Green:"\x1b[32m",
    Yellow:"\x1b[33m",
    Blue:"\x1b[34m",
    Purple:"\x1b[35m",
    Cyan:"\x1b[36m",
    White:"\x1b[37m"
}


class Color {
    static red(string) {
        return colors.Red+string+colors.Color_Off;
    }
    static green(string) {
        return colors.Green+string+colors.Color_Off;
    }
    static yellow(string) {
        return colors.Yellow+string+colors.Color_Off;
    }
    static blue(string) {
        return colors.Blue+string+colors.Color_Off;
    }
    static magenta(string) {
        return colors.Purple+string+colors.Color_Off;
    }
    static cyan(string) {
        return colors.Cyan+string+colors.Color_Off;
    }
    static reset() {
        return colors.Color_Off;
    }
}

export default Color