import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, writeBatch, query, orderBy } from 'firebase/firestore';

export interface Mission {
  id?: string;
  region: string;
  description: string;
  target: number;
  raised: number;
  image_url: string;
  created_at?: string;
}

const initialMissions = [
  { region: "Maputo - Moçambique", description: "Construção de poços artesianos e infraestrutura básica.", raised: 5789, target: 15230, image_url: "https://picsum.photos/seed/missao1/800/600", created_at: new Date().toISOString() },
  { region: "Sertão - Pernambuco", description: "Apoio a pequenos produtores com tecnologia de irrigação.", raised: 45000, target: 50000, image_url: "https://picsum.photos/seed/missao2/800/600", created_at: new Date().toISOString() },
  { region: "Periferia - São Paulo", description: "Criação de centro de formação tecnológica.", raised: 1250, target: 80000, image_url: "https://picsum.photos/seed/missao3/800/600", created_at: new Date().toISOString() },
];

interface MissionsContextType {
  missions: Mission[];
  addDonation: (id: string, amount: number) => void;
  refreshMissions: () => void;
}

const MissionsContext = createContext<MissionsContextType | undefined>(undefined);

export const MissionsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [missions, setMissions] = useState<Mission[]>([]);

  const fetchMissions = async () => {
    try {
      const q = query(collection(db, 'missions'), orderBy('created_at', 'asc'));
      const snapshot = await getDocs(q);
      
      // Seed if empty table
      if (snapshot.empty) {
        const batch = writeBatch(db);
        initialMissions.forEach(m => {
            const docRef = doc(collection(db, 'missions'));
            batch.set(docRef, m);
        });
        await batch.commit();
        
        // Re-fetch after seeding
        const retrySnapshot = await getDocs(q);
        setMissions(retrySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Mission)));
      } else {
        setMissions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Mission)));
      }
    } catch (e) {
      console.error("Erro ao puxar missoes do Firebase:", e);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const addDonation = async (id: string, amount: number) => {
    const mission = missions.find(m => m.id === id);
    if (!mission) return;

    const newRaised = Number(mission.raised || 0) + amount;
    
    // Update Local First mapping UI instantly
    setMissions(prev => prev.map(m => m.id === id ? { ...m, raised: newRaised } : m));
    
    // Sync backend
    await updateDoc(doc(db, 'missions', id), { raised: newRaised });

    // Also log a transaction for Transparency
    await addDoc(collection(db, 'transactions'), {
      tx_date: new Date().toLocaleDateString('pt-BR'),
      description: `Doação Web: ${mission.region}`,
      amount: `+ R$ ${amount.toLocaleString('pt-BR')},00`,
      is_positive: true,
      created_at: new Date().toISOString()
    });
  };

  return (
    <MissionsContext.Provider value={{ missions, addDonation: addDonation as any, refreshMissions: fetchMissions }}>
      {children}
    </MissionsContext.Provider>
  );
}

export const useMissions = () => {
  const context = useContext(MissionsContext);
  if (!context) throw new Error("useMissions must be used within MissionsProvider");
  return context;
};
