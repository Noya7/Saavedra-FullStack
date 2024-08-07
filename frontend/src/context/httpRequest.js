const DEFAULT_ERROR_MSG = "Ocurrio un error inesperado al intentar conectar con el servidor. por favor intenta de nuevo mas tarde."

export default async (params) => {
    let response;
    let headers = new Object;
    params.json && (headers["Content-Type"] = "application/json");
    params.headers && (headers = {...headers, ...params.headers});
    if (params.method !== 'GET'){
        response = await fetch(import.meta.env.VITE_BACKEND_URL + params.suffix, {
            body: params.formData ? params.body : JSON.stringify(params.body),
            method: params.method,
            credentials: "include",
            headers
        })
    } else {
        response = await fetch(import.meta.env.VITE_BACKEND_URL + params.suffix, {
        method: params.method,
        credentials: "include",
        headers
    })}
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || DEFAULT_ERROR_MSG);
    return data;
}