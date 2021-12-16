import Gun from 'gun/gun'
import { newNameSpace } from './Models'


const port = process.env.PORT ||'5150'
const address = process.env.URL || '0.0.0.0'
const peers = [`http://${address}:${port}/gun`]

export const gun = new Gun({
  peers: peers,
})


export const createNameSpace = (name:string, soul:string) => {
  const project = newNameSpace(name, soul)
  console.log('Creating', project)
  // gun.get('history').get('projects').get(project[0]).set(project[1])
  // gun.get('projects').get(project[0]).put(project[1])
}

export const updateProject = (project: any[], updates: any) => {
  let projectEdit = project
  Object.assign(projectEdit[1], updates)
  if (projectEdit[1].deleted) { projectEdit[1].deleted = null }
  projectEdit[1].edited = new Date().toString()
  console.log('Updating', projectEdit)
  gun.get('history').get('projects').get(project[0]).set(projectEdit[1])
  gun.get('projects').get(projectEdit[0]).put(projectEdit[1])
}

// explict updating for debuggin
// export const updateProject = (project, updates) => {
//   let projectEdit = project
//   projectEdit[1].name = updates.name
//   projectEdit[1].color = updates.color
//   if (projectEdit[1].deleted) { projectEdit[1].deleted = null }
//   projectEdit[1].edited = new Date().toString()
//   console.log('Updating', projectEdit)
//   gun.get('history').get('projects').get(project[0]).set(projectEdit[1])
//   gun.get('projects').get(projectEdit[0]).put(projectEdit[1])
// }

export const restoreProject = (project: any) => {
  let restoredProject = project
  // restoredProject[1].restored = new Date().toString()
  if (restoredProject[1].status === 'deleted') {
    restoredProject[1].status = 'active'
    // gun.get('history').get('projects').get(restoredProject[0]).set(restoredProject[1])
  }
  console.log('Restoring', restoredProject)
  gun.get('projects').get(restoredProject[0]).put(restoredProject[1])
}


export const deleteProject = (project: any[]) => {
  console.log('Deleting', project)
  let projectDelete = project
  projectDelete[1].deleted = new Date().toString()
  gun.get('history').get('projects').get(projectDelete[0]).set(projectDelete[1])
  projectDelete[1].status = 'deleted'
  gun.get('projects').get(project[0]).put(projectDelete[1])
}
