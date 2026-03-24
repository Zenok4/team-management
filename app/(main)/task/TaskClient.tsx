"use client";

import { getTasks } from "@/services/task-service";
import { TasksContent } from "./_components/task-content";
import { useEffect, useState } from "react";
import { getMembers } from "@/services/member-service";
import { getMangas } from "@/services/manga-service";
import { getRoles } from "@/services/role-service";

const TaskClient = () => {
  const [tasks, setTasks] = useState<any>();
  const [members, setMembers] = useState<any>();
  const [manga, setManga] = useState<any>();
  const [roles, setRoles] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const [tasksData, membersData, mangaData, rolesData] = await Promise.all([
        getTasks(),
        getMembers(),
        getMangas(),
        getRoles(),
      ]);

      console.log("tasksData", tasksData);
      console.log("membersData", membersData);
      console.log("mangaData", mangaData);
      console.log("rolesData", rolesData);

      setTasks(tasksData);
      setMembers(membersData);
      setManga(mangaData);
      setRoles(rolesData);
      setLoading(false);
    };

    fetchData();
  }, []);
  
  return loading ? (
    <div>loading...</div>
  ) : (
    <TasksContent
      initialTasks={tasks}
      members={members}
      mangas={manga}
      roles={roles}
    />
  );
};

export default TaskClient;
