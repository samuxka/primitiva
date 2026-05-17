import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Mission {
  id?: string;
  region: string;
  description: string;
  target: number;
  raised: number;
  image_url: string;
}

const initialMissions = [
  { region: "Maputo - Moçambique", description: "Construção de poços artesianos e infraestrutura básica.", raised: 5789, target: 15230, image_url: "https://picsum.photos/seed/missao1/800/600" },
  { region: "Sertão - Pernambuco", description: "Apoio a pequenos produtores com tecnologia de irrigação.", raised: 45000, target: 50000, image_url: "https://picsum.photos/seed/missao2/800/600" },
  { region: "Periferia - São Paulo", description: "Criação de centro de formação tecnológica.", raised: 1250, target: 80000, image_url: "https://picsum.photos/seed/missao3/800/600" },
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
      let { data, error } = await supabase.from('missions').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      
      // Seed if empty table
      if (!data || data.length === 0) {
        await supabase.from('missions').insert(initialMissions);
        const retry = await supabase.from('missions').select('*').order('created_at', { ascending: true });
        data = retry.data;
      }
      if (data) setMissions(data);
    } catch (e) {
      console.error("Erro ao puxar missoes do Supabase:", e);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const addDonation = async (id: string, amount: number) => {
    const mission = missions.find(m => m.id === id);
    if (!mission) return;

    const newRaised = Number(mission.raised) + amount;
    
    // Update Local First mapping UI instantly
    setMissions(prev => prev.map(m => m.id === id ? { ...m, raised: newRaised } : m));
    
    // Sync backend
    await supabase.from('missions').update({ raised: newRaised }).eq('id', id);

    // Also log a transaction for Transparency
    await supabase.from('transactions').insert({
      tx_date: new Date().toLocaleDateString('pt-BR'),
      description: `Doação Web: ${mission.region}`,
      amount: `+ R$ ${amount.toLocaleString('pt-BR')},00`,
      is_positive: true
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
