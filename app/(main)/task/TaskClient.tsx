"use client"

import { MOCK_MANGA, MOCK_MEMBERS, MOCK_ROLES, MOCK_TASKS } from "@/mock/mock-data";
import { TasksContent } from "./_components/task-content";

const TaskClinet = () => {
    const tasks = MOCK_TASKS
    const members = MOCK_MEMBERS
    const manga = Array.isArray(MOCK_MANGA) ? MOCK_MANGA : [MOCK_MANGA]
    const roles = MOCK_ROLES
    return (
        <TasksContent
            initialTasks={tasks}
            members={members}
            mangas={manga}
            roles={roles}
        />
    );
}
 
export default TaskClinet;