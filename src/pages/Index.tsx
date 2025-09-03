import { TodoList } from '@/components/TodoList';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Mobile Todo App</h1>
          <p className="text-muted-foreground">Assignment 1 - Mobile & IoT Development</p>
        </div>
        <TodoList />
      </div>
    </div>
  );
};

export default Index;
