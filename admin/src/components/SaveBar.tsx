import { IcSave } from './icons';

type Props = {
  dirty: boolean;
  saving?: boolean;
  onSave: () => void;
  onReset?: () => void;
};

export default function SaveBar({ dirty, saving, onSave, onReset }: Props) {
  return (
    <div className="save-bar">
      <span className={`status ${dirty ? 'dirty' : ''}`}>
        {saving ? 'Зберігаємо…' : dirty ? 'Є незбережені зміни' : 'Все збережено'}
      </span>
      <div style={{ display: 'flex', gap: 8 }}>
        {onReset && (
          <button className="btn btn-ghost" type="button" disabled={!dirty || saving} onClick={onReset}>
            Відкотити
          </button>
        )}
        <button className="btn btn-primary" type="button" disabled={!dirty || saving} onClick={onSave}>
          <IcSave size={14} /> Зберегти
        </button>
      </div>
    </div>
  );
}
