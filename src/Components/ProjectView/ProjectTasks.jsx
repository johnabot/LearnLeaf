import logo from '/src/LearnLeaf_Name_Logo_Wide.png';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '/src/UserState.jsx';
import { fetchProjects, fetchTasks, logoutUser } from '/src/LearnLeaf_Functions.jsx';
import TasksTable from '/src/Components/TaskView/TaskTable.jsx';
import { AddTaskForm } from '/src/Components/TaskView/AddTaskForm.jsx';

const ProjectTasks = () => {
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false);
    const { user } = useUser();
    const { projectId } = useParams(); // Get projectId from URL params
    const [filterCriteria, setFilterCriteria] = useState({
        searchQuery: '',
        priority: '',
        status: '',
        startDate: '',
        startDateComparison: '',
        dueDate: '',
        dueDateComparison: '',
    });

    // useEffect to fetch the project data
    useEffect(() => {
        if (user?.id && projectId) {
            setTasks([]); // Clear tasks while loading new project
            fetchProjects(user.id, projectId)
                .then(fetchedProjects => {
                    if (fetchedProjects.length > 0) {
                        setProject(fetchedProjects[0]);
                        console.log("Project fetched: ", fetchedProjects[0]);
                    } else {
                        setProject(null);
                    }
                })
                .catch(error => {
                    console.error("Error fetching project:", error);
                    setProject(null);
                });
        } else {
            setProject(null);
        }
    }, [user?.id, projectId]);

    // useEffect to fetch tasks when the project is set
    useEffect(() => {
        if (user?.id && project) {
            fetchTasks(user.id, null, project.projectName)
                .then(fetchedTasks => {
                    setTasks(fetchedTasks);
                    console.log("Tasks fetched for project: ", project.projectName);
                })
                .catch(error => console.error("Error fetching tasks for project:", error));
        }
    }, [user?.id, project]); // This useEffect triggers when `project` is set.


    const refreshTasks = async () => {
        const updatedTasks = await fetchTasks(user.id, null, project.projectName);
        setTasks(updatedTasks);
    };

    const toggleFormVisibility = () => setIsAddTaskFormOpen(!isAddTaskFormOpen);

    const handleCloseAddTaskForm = () => {
        setIsAddTaskFormOpen(false);
        refreshTasks();
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            updateUser(null);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const filterByDate = (taskDateStr, filterDateStr, comparisonType) => {
        let taskDate = new Date(taskDateStr);
        taskDate = new Date(taskDate.getTime() - taskDate.getTimezoneOffset() * 60000).setHours(0, 0, 0, 0);

        let filterDate = new Date(filterDateStr);
        filterDate = new Date(filterDate.getTime() - filterDate.getTimezoneOffset() * 60000).setHours(0, 0, 0, 0);


        switch (comparisonType) {
            case 'before':
                return taskDate < filterDate;
            case 'before-equal':
                return taskDate <= filterDate;
            case 'equal':
                return taskDate === filterDate;
            case 'after':
                return taskDate > filterDate;
            case 'after-equal':
                return taskDate >= filterDate;
            default:
                return true;
        }
    };

    const getFilteredTasks = (tasks, filterCriteria) => {
        const filteredTasks = tasks.filter((task) => {
            // Search filter
            const matchesSearchQuery = filterCriteria.searchQuery === '' || task.assignment.toLowerCase().includes(filterCriteria.searchQuery.toLowerCase());

            // Check for priority and status filters
            const matchesPriority = !filterCriteria.priority || task.priority === filterCriteria.priority;
            const matchesStatus = !filterCriteria.status || task.status === filterCriteria.status;

            // Start Date filtering
            let matchesStartDate = true;
            if (filterCriteria.startDateComparison === "none") {
                matchesStartDate = !task.startDate; // Match tasks with no start date
            } else if (filterCriteria.startDate) {
                // Apply date comparison logic if startDate is provided and comparison isn't "none"
                matchesStartDate = filterByDate(task.startDate, filterCriteria.startDate, filterCriteria.startDateComparison);
            }

            // Due Date filtering
            let matchesDueDate = true;
            if (filterCriteria.dueDateComparison === "none") {
                matchesDueDate = !task.dueDate; // Match tasks with no due date
            } else if (filterCriteria.dueDate) {
                // Apply date comparison logic if dueDate is provided and comparison isn't "none"
                matchesDueDate = filterByDate(task.dueDate, filterCriteria.dueDate, filterCriteria.dueDateComparison);
            }

            // Return true if task matches all criteria
            return matchesSearchQuery && matchesPriority && matchesStatus && matchesStartDate && matchesDueDate;
        });

        return filteredTasks;
    };

    const clearFilters = () => {
        setFilterCriteria({
            searchQuery: '',
            priority: '',
            status: '',
            startDate: '',
            startDateComparison: '',
            dueDate: '',
            dueDateComparison: '',
        });
    };


    return (
        <div className="view-container">
            <div className="top-bar">
                <img src={logo} alt="LearnLeaf_name_logo"/>
                <div className="top-navigation">
                    <nav className="nav-links">
                        <a href="/tasks">Tasks</a>
                        <a href="/calendar">Calendar</a>
                        <a href="/subjects">Subjects</a>
                        <a href="/projects">Projects</a>
                        <a href="/archives">Archives</a>
                        <a href="/profile">User Profile</a>
                    </nav>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <button className="fab" onClick={toggleFormVisibility}>+</button>
            {isAddTaskFormOpen && (
                <AddTaskForm
                    initialProject={project.projectName}
                    initialSubject={project.subject}
                    isOpen={isAddTaskFormOpen}
                    onClose={handleCloseAddTaskForm}
                    refreshTasks={refreshTasks}
                />
            )}
            <div>
                <h1 style={{ color: '#907474' }}>{project ? `Upcoming Tasks for ${project.projectName}` : 'Loading project...'}</h1>
                <TasksTable tasks={tasks} refreshTasks={refreshTasks} />
            </div>
        </div>
    );
};

export default ProjectTasks;
