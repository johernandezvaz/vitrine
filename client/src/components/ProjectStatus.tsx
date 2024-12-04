import React from 'react';
import {
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";

interface ProjectStatusProps {
  status: string;
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <FaCheckCircle className="text-green-500" />;
    case "in_progress":
      return <FaClock className="text-blue-500" />;
    case "pending":
      return <FaExclamationCircle className="text-yellow-500" />;
    default:
      return null;
  }
};

const ProjectStatus: React.FC<ProjectStatusProps> = ({ status }) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs flex items-center gap-2 ${getStatusColor(
        status
      )}`}
    >
      {getStatusIcon(status)}
      {status}
    </span>
  );
};

export default ProjectStatus;