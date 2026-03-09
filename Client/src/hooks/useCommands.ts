import {useCallback, useState} from "react";
import {commandClient} from "../api-clients.ts";

const COMMANDS = [
    { id: 'start', label: 'Start Turbine', icon: '▶️', description: 'Bring turbine online', paramField: null },
    { id: 'stop', label: 'Stop Turbine', icon: '⏹️', description: 'Graceful shutdown', paramField: { label: 'Reason (optional)', type: 'text' } },
    { id: 'interval', label: 'Set Interval', icon: '🔧', description: 'Set interval for TRX updates', paramField: { label: 'Interval (seconds)', type: 'number' } },
    { id: 'bladePitch', label: 'Set Blade Pitch', icon: '🔧', description: 'Set blade pitch for windmill', paramField: { label: 'Blade Pitch (degrees)', type: 'number' } },
]

export const useCommands = () => {
    const [selected, setSelected] = useState<string | null>(null);
    const [paramValue, setParamValue] = useState('');
    const [confirmed, setConfirmed] = useState(false);

    const handleSelect = (id: string) => {
        setSelected(id);
        setParamValue('');
    };

    const handleSend = useCallback(async (farmId: string, turbineId: string, onClose: () => void) => {
        if (!selected) return;
        const selectedCommand = COMMANDS.find(cmd => cmd.id === selected);
        const command: Record<string, unknown> = { type: selected };
        if (selectedCommand?.paramField && paramValue.trim() !== '') {
            command['value'] = selectedCommand.paramField.type === 'number' ? Number(paramValue) : paramValue;
        }

        if(selected === 'stop'){
            const action = "stop";
            const reason = paramValue;

            const data = {action, reason};

            await commandClient.sendCommand(farmId, turbineId, data);

        }
        if(selected === 'start'){
            const action = "start";
            const data = {action};

            await commandClient.sendCommand(farmId, turbineId, data);
        }
        if(selected === 'interval'){
            const action = "setInterval";
            const value = paramValue;
            const data = {action, value};

            await commandClient.sendCommand(farmId, turbineId, data);
        }

        setConfirmed(true);
        setTimeout(onClose, 1200);
    }, [selected, paramValue]);

    return { selected, paramValue, setParamValue, confirmed, COMMANDS, handleSelect, handleSend };
};
