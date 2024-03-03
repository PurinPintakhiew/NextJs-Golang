import { getUsers } from "@/servers/api/users";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const fetchData = async () => {
    try {
      setIsInitialRender(false);

      const result = await getUsers();
      if (Array.isArray(result?.data?.data) && result?.data?.data?.length > 0) {
        setData(result?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isInitialRender) {
      fetchData();
    }
  }, [isInitialRender]);

  return (
    <>
      <h1 className="text-2xl font-bold">User List</h1>
      <div className="p-4">
        <table className="w-full border">
          <thead className="border">
            <tr>
              <th className="border">id</th>
              <th className="border">user name</th>
              <th className="border">email</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any) => (
              <tr key={item?.id}>
                <td className="border">{item?.id}</td>
                <td className="border">{item?.userName}</td>
                <td className="border">{item?.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
