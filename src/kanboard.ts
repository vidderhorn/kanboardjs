import Proxy from "jsonrpc-proxy";
import { UnixTime, Flag, Text } from "typedtext";
const rename = require("deep-rename-keys");

export module Kanboard {
  export function client(url: string, apiToken: string, timeLimit?: number) {
    const credential = Buffer.from(`jsonrpc:${apiToken}`).toString("base64");
    return Proxy.post<Service>(url, {
      timeLimit,
      formatParams: renameKeys(Text.camelToSnake),
      formatValue: renameKeys(Text.snakeToCamel)
    }, {
      Authorization: `Basic ${credential}`
    });
  }

  export interface Service {
    getAllProjects(): Promise<Project[]>;
    getProjectById(params: { projectId: number | string }): Promise<Project>;
    getProjectMetadata<M = Metadata>(params: { projectId: number | string }): Promise<M>;
    saveProjectMetadata(params: { projectId: number | string; meta: Metadata }): Promise<boolean>
    getAllTasks(params: { projectId: number | string; statusId: Flag }): Promise<Task[]>;
    updateProject(params: {
      projectId: number | string;
      name?: string;
      description?: string;
      ownerId?: number;
      identifier?: string;
      startDate?: string;
      endDate?: string;
    }): Promise<boolean>;
  }

  export type Dict<V> = { [key: string]: V | undefined };
  export type Metadata = Dict<string>
  export type Color = {
    name: string;
    background: string;
    border: string;
  }
  
  export interface Project {
    id: string;
    name: string;
    isActive: Flag;
    token: string;
    lastModified: UnixTime;
    isPublic: Flag;
    isPrivate: Flag;
    isEverybodyAllowed: Flag;
    defaultSwimlane: string;
    showDefaultSwimlane: Flag;
    description: string | null;
    identifier: string;
    startDate: UnixTime;
    endDate: UnixTime;
    ownerId: string;
    priorityDefault: string;
    priorityStart: string;
    priorityEnd: string;
    email: string;
    predefinedEmailSubjects: string | null;
    perSwimlaneTaskLimits: string;
    taskLimit: string;
    enableGlobalTags: Flag;
    url: {
      board: string;
      list: string;
      calendar?: string;
    }
  }

  export interface Task {
    id: string;
    title: string;
    description: string;
    dateCreation: UnixTime;
    colorId: string;
    projectId: string;
    columnId: string;
    ownerId: string;
    position: string;
    isActive: Flag;
    dateCompleted: UnixTime | null;
    score: string;
    dateDue: UnixTime;
    categoryId: string;
    creatorId: string;
    dateModification: UnixTime;
    reference: string;
    dateStarted: UnixTime | null;
    timeSpent: string;
    timeEstimated: string;
    swimlaneId: string;
    dateMoved: UnixTime;
    recurrenceStatus: string;
    recurrenceTrigger: string;
    recurrenceFactor: string;
    recurrenceTimeframe: string;
    recurrenceBasedate: string;
    recurrenceParent: string | null;
    recurrenceChild: string | null;
    priority: string;
    externalProvider: string | null;
    externalUri: string | null;
    url: string;
    color: Color;
  }
}

export default Kanboard;

function renameKeys(renamer: (s: string) => string) {
  return (obj: any) => {
    if (obj && typeof(obj) === "object") return rename(obj, renamer);
    return obj;
  }
}

declare function require(name: string): any;
declare class Buffer {
  static from(s: string): Buffer;
  toString(t: string): string;
}
