export function errorCreator(message, errCode, errStatus){
    const err = new Error()
    err.message = message
    err.code = errCode;
    err.status= errStatus

    return err
 };

 