import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import Popup from './Popup';

interface OnboardingPopupProps {
  onComplete?: () => void;
}

export default function OnboardingPopup({ onComplete }: OnboardingPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const completed = await storageService.isOnboardingCompleted();
    if (!completed) {
      // setVisible(true);
      setVisible(true);
    }
  };

  const handleClose = async () => {
    await storageService.setOnboardingCompleted();
    setVisible(false);
    onComplete?.();
  };

  return (
    <Popup
      visible={visible}
      onClose={handleClose}
      type="info"
      title="Bienvenue sur Casual Coach !"
      message={`Parce qu'on est pas tous pros...
        Casual Coach est là pour te faire apprécier la course à pied sans prise de tête !</br></br>
        <b>Comment utiliser l'appli:</b>
        <ul style="text-align: left;">
          <li ><b>Crée ton plan d'entraînement personnalisé en quelques clics.</li>
          <li>Ton seul but, cocher toutes les scéances de la semaine, le reste, on verra après</li>
          <li>Amuse-toi et profite de chaque course !</li>
          </ul>
        </br>
        Note:  </br>
          Le respect de tes données personnelles est au max, ton plan est stocké directement sur ton tel ;)
        `}
      buttonText="C'est parti !"
    />
  );
}
