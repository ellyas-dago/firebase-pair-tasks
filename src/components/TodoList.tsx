import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

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
        .from('todos')
        .insert([{ title: newTodo.trim() }])
        .select()
        .single();

      if (error) throw error;
      
      setTodos([data, ...todos]);
      setNewTodo('');
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

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed })
        .eq('id', id);

      if (error) throw error;
      
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTodos(todos.filter(todo => todo.id !== id));
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Todo List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={addTodo} 
            disabled={loading || !newTodo.trim()}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {todos.map((todo) => (
            <div 
              key={todo.id} 
              className="flex items-center gap-3 p-3 border rounded-lg bg-card"
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={(checked) => 
                  toggleTodo(todo.id, checked as boolean)
                }
              />
              <span 
                className={`flex-1 ${
                  todo.completed 
                    ? 'line-through text-muted-foreground' 
                    : 'text-foreground'
                }`}
              >
                {todo.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {todos.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No todos yet. Add one above!
          </div>
        )}

        <div className="text-sm text-muted-foreground text-center">
          {todos.length} total • {todos.filter(t => !t.completed).length} pending
        </div>
      </CardContent>
    </Card>
  );
}