export const isValidEntry = (entry: string | any[]) =>  entry && Array.isArray(entry) && entry.length === 2 ? true : false
export const projectValid = (project: string | any[]) => Array.isArray(project) && project.length === 2 && project[1].type === 'project' ? true : false
export const nameValid = (name: string | any[]) => typeof name === 'string' && name.length > 0 ? true : false 