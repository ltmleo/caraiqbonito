import React from 'react';
import styles from './styles.module.css';

interface AttractionInfoProps {
  /** É pago? true = pago, false = gratuito */
  paid?: boolean;
  /** Valor do ingresso, ex: "€15", "R$ 30" ou "Gratuito" */
  price?: string;
  /** Reserva antecipada obrigatória? */
  reservation?: boolean;
  /** Label do link de reserva, ex: "bundestag.de" */
  reservationLink?: string;
  /** URL completa do site de reserva, ex: "https://www.bundestag.de" */
  reservationUrl?: string;
  /** Duração sugerida, ex: "1–2h", "Dia inteiro" */
  duration?: string;
  /** Qualquer nota rápida extra, ex: "Fechado às segundas" */
  note?: string;
}

export default function AttractionInfo({
  paid,
  price,
  reservation,
  reservationLink,
  reservationUrl,
  duration,
  note,
}: AttractionInfoProps) {
  return (
    <div className={styles.wrap}>
      {/* Pago / Gratuito */}
      {paid !== undefined && (
        <span className={`${styles.badge} ${paid ? styles.paid : styles.free}`}>
          {paid ? '💳 Pago' : '🆓 Gratuito'}
        </span>
      )}

      {/* Preço */}
      {price && (
        <span className={`${styles.badge} ${styles.neutral}`}>
          🎟️ {price}
        </span>
      )}

      {/* Reserva */}
      {reservation !== undefined && (
        reservation ? (
          <span className={`${styles.badge} ${styles.warn}`}>
            📅 Reserva antecipada
            {reservationLink && (
              <>
                {' · '}
                {reservationUrl ? (
                  <a
                    href={reservationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {reservationLink}
                  </a>
                ) : (
                  reservationLink
                )}
              </>
            )}
          </span>
        ) : (
          <span className={`${styles.badge} ${styles.neutral}`}>
            ✅ Sem reserva
          </span>
        )
      )}

      {/* Duração */}
      {duration && (
        <span className={`${styles.badge} ${styles.neutral}`}>
          ⏱️ {duration}
        </span>
      )}

      {/* Nota extra */}
      {note && (
        <span className={`${styles.badge} ${styles.neutral}`}>
          ℹ️ {note}
        </span>
      )}
    </div>
  );
}
