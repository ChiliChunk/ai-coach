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
    setVisible(true);
    if (!completed) {
      // setVisible(true);
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
          <li >Fais les scéances comme tu le sens: ton seul but, cocher tout les scéance de la semaine, l'ordre on verra après</li>
        </ul>
        `}
      buttonText="C'est parti !"
    />
  );
}
