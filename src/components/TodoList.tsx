import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "./TodoList.css"; // Import the CSS file for animations

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch todos",
        variant: "destructive",
      });
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([{ title: newTodo, completed: false }]);

      if (error) throw error;

      setTodos([data[0], ...todos]);
      setNewTodo("");
      toast({
        title: "Success",
        description: "Todo added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeTodo = async (id: string) => {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) throw error;

      setTodos(todos.filter((todo) => todo.id !== id));
      toast({
        title: "Success",
        description: "Todo deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="todo-list">
      <Card className="todo-card">
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="todo-input">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task"
            />
            <Button onClick={addTodo} disabled={loading} className="add-button">
              <Plus />
            </Button>
          </div>
          <ul className="todo-items">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => {
                    // Handle checkbox change
                  }}
                />
                <span className="todo-title">{todo.title}</span>
                <Button
                  variant="ghost"
                  onClick={() => removeTodo(todo.id)}
                  className="delete-button"
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
