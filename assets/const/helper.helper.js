export const returnInitialOfNames = ({ fsname, lsname }) => {
    if(fsname && fsname.length > 0 && lsname && lsname.length > 0){

        fsname = fsname.toString().trim();
        lsname = lsname.toString().trim();
        console.log(" Lsname => ", lsname);
        return `${fsname.substring(0,1)}${lsname.substring(0,2)}`;

    }else{
        return "--"
    }
};

export const passwordValidator = ({ chaine }) => {
    if((/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).test(chaine.toString())) return true;
    else return false;
};