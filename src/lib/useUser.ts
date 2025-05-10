import { useState, useEffect } from "react";
import axios from "axios";

export interface User {
  _id: string;
  name: string;
  email: string;
  role_id: string;
  company_id: string;
  department_id: string | null;
  team_id: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  _id: string;
  name: string;
}

export interface Company {
  _id: string;
  name: string;
}

export interface Team {
  _id: string;
  name: string;
  department_id: Department;
}


export interface Department {
  _id: string;
  name: string;
  company_id: Company;  // This now references the Company interface
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [teams, setTeams] = useState<Team[]>([]); // New state for teams
  const [departments, setDepartments] = useState<Department[]>([]); // New state for departments
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [teamsByDepartment, setTeamsByDepartment] = useState<Team[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const [usersRes, rolesRes, companiesRes, teamsRes, departmentsRes] = await Promise.all([
          axios.get("https://qthl-group.onrender.com/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://qthl-group.onrender.com/api/role", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://qthl-group.onrender.com/api/company", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://qthl-group.onrender.com/api/team", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://qthl-group.onrender.com/api/department", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(usersRes.data);
        setRoles(rolesRes.data);
        setCompanies(companiesRes.data);
        setTeams(teamsRes.data); // Set teams data
        setDepartments(departmentsRes.data); // Set departments data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDepartmentsByCompany = async () => {
      if (!selectedCompanyId) return;

      try {
        const response = await axios.get(
          `https://qthl-group.onrender.com/api/department/company/${selectedCompanyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Nếu phản hồi thành công và có dữ liệu phòng ban
        if (response.status === 200) {
          if (response.data.length > 0) {
            setDepartments(response.data);
          } else {
            setDepartments([]); // Nếu không có phòng ban
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy phòng ban theo công ty:", error);
        setDepartments([]); // reset nếu có lỗi
      }
    };
    fetchDepartmentsByCompany();
  }, [selectedCompanyId]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchTeamsByDepartment = async () => {
      if (!selectedDepartmentId) return; // Kiểm tra nếu không có phòng ban được chọn

      try {
        const response = await axios.get(
          `https://qthl-group.onrender.com/api/team/department/${selectedDepartmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Nếu phản hồi thành công
        if (response.status === 200) {
          setTeamsByDepartment(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy team theo phòng ban:", error);
        setTeamsByDepartment([]); // Reset nếu có lỗi
      }
    };

    fetchTeamsByDepartment();
  }, [selectedDepartmentId]); // Dependency: khi phòng ban thay đổi



  const getRoleName = (roleId: string) => {
    return roles.find((r) => r._id === roleId)?.name || "N/A";
  };

  const getCompanyName = (companyId: string) => {
    return companies.find((c) => c._id === companyId)?.name || "N/A";
  };

  const getTeamName = (teamId: string | null) => {
    return teams.find((t) => t._id === teamId)?.name || "N/A";
  };

  const getDepartmentName = (departmentId: string | null) => {
    return departments.find((d) => d._id === departmentId)?.name || "N/A";
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://qthl-group.onrender.com/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Lỗi xoá người dùng:", error);
    }
  };

  // Add User

  return {
    users,
    roles,
    companies,
    teams,
    departments,
    getRoleName,
    getCompanyName,
    getTeamName, // Return function to get team name
    getDepartmentName, // Return function to get department name
    searchTerm,
    setSearchTerm,
    currentPage,
    rowsPerPage,
    handleRowsPerPageChange,
    filteredUsers,
    currentUsers,
    paginate,
    handleDelete,
    selectedCompanyId,
    setSelectedCompanyId,
    teamsByDepartment,
    setSelectedDepartmentId
  };
}
