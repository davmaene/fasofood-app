export const returnInitialOfNames = ({ fsname, lsname }) => {
    if(fsname.length > 0 && lsname.length > 0){

        fsname = fsname.toString().trim();
        lsname = lsname.toString().trim();

        return `${fsname.substring(0,1)}${lsname.substring(0,1)}`;

    }else{
        return "--"
    }
};