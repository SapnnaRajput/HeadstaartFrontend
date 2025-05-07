import { useState } from "react";
import { Star, X, Plus, Save } from "lucide-react";

const TodoComponent = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          starred: false,
          completed: false,
        },
      ]);
      setNewTodo("");
      setIsEditing(false);
    }
  };

  const toggleStar = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, starred: !todo.starred } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleCompleted = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Add New To-Do" : "My To-Do List"}
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {isEditing && (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Write your task name here"
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
            />
            <button
              onClick={handleAddTodo}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompleted(todo.id)}
              className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span
              className={`flex-1 ${
                todo.completed ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => toggleStar(todo.id)}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <Star
                className={`w-5 h-5 ${
                  todo.starred
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400"
                }`}
              />
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        ))}
      </div>

      {todos.length === 0 && !isEditing && (
        <div className="text-center text-gray-500 py-8">
          No todos yet. Click the plus button to add one!
        </div>
      )}
    </div>
  );
};

export default TodoComponent;
