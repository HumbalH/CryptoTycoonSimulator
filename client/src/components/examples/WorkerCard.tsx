import WorkerCard from '../WorkerCard';
import { useState } from 'react';

export default function WorkerCardExample() {
  const [cash, setCash] = useState(15000);
  
  const workers = [
    {
      id: "tech1",
      name: "Technician",
      description: "Basic PC maintenance",
      cost: 5000,
      efficiency: 10,
      capacity: 3,
      level: 1,
      unlocked: true,
      type: "technician" as const
    },
    {
      id: "eng1",
      name: "Engineer",
      description: "Advanced optimization expert",
      cost: 20000,
      efficiency: 25,
      capacity: 5,
      level: 0,
      unlocked: true,
      type: "engineer" as const
    },
    {
      id: "expert1",
      name: "Expert",
      description: "Elite mining specialist",
      cost: 100000,
      efficiency: 50,
      capacity: 10,
      level: 0,
      unlocked: false,
      type: "expert" as const
    }
  ];

  const handleHire = (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (worker && cash >= worker.cost) {
      setCash(cash - worker.cost);
      console.log(`Hired ${worker.name}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-background">
      {workers.map(worker => (
        <WorkerCard 
          key={worker.id}
          worker={worker}
          canAfford={cash >= worker.cost}
          onHire={handleHire}
        />
      ))}
    </div>
  );
}
