import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { JamChevronCircleDown, JamChevronCircleRight } from "../utils/Icons";
import { defaultStyleConfig, StyleConfig } from '../Types';
import FontSwitcher from './FontSwitcher';

// Props 類型定義


interface NumberInputProps {
    path: string[];
    label: string;
    min?: number;
    max?: number;
    step?: number;
    config: StyleConfig;
    updateConfig: (path: string[], value: number) => void;
}

interface ColorInputProps {
    path: string[];
    label: string;
    config: StyleConfig;
    updateConfig: (path: string[], value: string) => void;
}

interface StringInputProps {
    path: string[];
    label: string;
    config: StyleConfig;
    updateConfig: (path: string[], value: string) => void;
}

interface SelectInputProps {
    path: string[];
    label: string;
    config: StyleConfig;
    updateConfig: (path: string[], value: string) => void;
    options: { name: string, value: string }[]
}

interface BooleanInputProps {
    path: string[];
    label: string;
    config: StyleConfig;
    updateConfig: (path: string[], value: boolean) => void;
}

interface SectionProps {
    title: string;
    children: React.ReactNode;
    section: string;
    // section: keyof typeof defaultStyleConfig;
    isExpanded: boolean;
    onToggle: (section: string) => void;
}

// 工具函數：安全地獲取嵌套值
const getNestedValue = (obj: any, path: string[]): any => {
    return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};

// NumberInput 組件
const NumberInput: React.FC<NumberInputProps> = ({
    path,
    label,
    min = 0,
    max = 100,
    step = 1,
    config,
    updateConfig
}) => {
    const initialValue = getNestedValue(config, path) ?? 0;
    const [localValue, setLocalValue] = useState<string>(initialValue.toString());

    const debouncedUpdate = useCallback(
        debounce((value: number) => {
            updateConfig(path, value);
        }, 300),
        [path, updateConfig]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        const numberValue = Number(newValue);
        if (!isNaN(numberValue)) {
            debouncedUpdate(numberValue);
        }
    };


    useEffect(() => {
        updateConfig(path, Number(localValue))
    }, [])

    const handleBlur = () => {
        let numberValue = Number(localValue);

        if (isNaN(numberValue)) {
            numberValue = initialValue;
        } else {
            numberValue = Math.min(Math.max(numberValue, min), max);
        }

        setLocalValue(numberValue.toString());
        updateConfig(path, numberValue);
    };

    return (
        <div className="flex items-center justify-between mb-2">
            <label className="text-sm">{label}</label>
            <input
                type="number"
                value={localValue}
                min={min}
                max={max}
                step={step}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-20 p-1 border rounded bg-gray-50 h-9"
            />
        </div>
    );
};

// ColorInput 組件
const ColorInput: React.FC<ColorInputProps> = ({
    path,
    label,
    config,
    updateConfig
}) => {
    const value = getNestedValue(config, path) ?? '#000000';
    const [localValue, setLocalValue] = useState(value);

    const debouncedUpdate = useCallback(
        debounce((value: string) => {
            updateConfig(path, value);
        }, 300),
        [path, updateConfig]
    );


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        debouncedUpdate(newValue)
    };

    useEffect(() => {
        updateConfig(path, localValue)
    }, [])

    return (
        <div className="flex items-center justify-between mb-2">
            <label className="text-sm">{label}</label>
            <input
                type="color"
                value={localValue}
                onChange={handleChange}
                className="w-20 p-1 border rounded bg-gray-50 h-9"
            />
        </div>
    );
};

// StringInput 組件
const StringInput: React.FC<StringInputProps> = ({
    path,
    label,
    config,
    updateConfig
}) => {
    const value = getNestedValue(config, path) ?? '';
    const [localValue, setLocalValue] = useState(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        updateConfig(path, newValue);
    };


    useEffect(() => {
        updateConfig(path, localValue)
    }, [])

    return (
        <div className="flex items-center justify-between mb-2">
            <label className="text-sm">{label}</label>
            <input
                type="text"
                value={localValue}
                onChange={handleChange}
                className="w-40 p-1 border rounded bg-gray-50 h-9"
            />
        </div>
    );
};

// SelectInput 組件
const SelectInput: React.FC<SelectInputProps> = ({
    path,
    label,
    config,
    options,
    updateConfig
}) => {
    const value = getNestedValue(config, path) ?? '';
    const [localValue, setLocalValue] = useState(value);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        updateConfig(path, newValue);
    };

    useEffect(() => {
        updateConfig(path, localValue)
    }, [])

    return (
        <div className="flex items-center justify-between mb-2">
            <label className="text-sm">{label}</label>
            <select className=" w-40 p-1 border rounded bg-gray-50 h-9" value={localValue} onChange={handleChange}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

// BooleanInput 組件
const BooleanInput: React.FC<BooleanInputProps> = ({
    path,
    label,
    config,
    updateConfig
}) => {
    const value = getNestedValue(config, path) ?? false;
    const [localValue, setLocalValue] = useState(value);

    const handleChange = () => {
        updateConfig(path, !localValue);
        setLocalValue(!localValue);
    };

    useEffect(() => {
        updateConfig(path, localValue)
    }, [])

    return (
        <div className="flex items-center justify-between mb-2">
            <label className="text-sm">{label}</label>
            <div className=' w-20 px-2 pt-[5px] border rounded bg-gray-50 h-9' onClick={handleChange}>
                <div className={` w-6 h-6 border rounded m-auto ${localValue ? "bg-blue-300" : "bg-gray-200"}`}>
                </div>
            </div>
        </div>
    );
};

// StringInput 組件
const FontsInput: React.FC<StringInputProps> = ({
    path,
    label,
    config,
    updateConfig
}) => {
    const value = getNestedValue(config, path) ?? '#000000';
    const [localValue, setLocalValue] = useState(value);

    const handleChange = (newValue: string) => {
        setLocalValue(newValue);
        updateConfig(path, newValue);
    };

    useEffect(() => {
        updateConfig(path, localValue)
    }, [])

    return (
        <div className="flex items-center justify-between mb-2">
            <label className="text-sm">{label}</label>
            <FontSwitcher value={localValue} changeCallback={handleChange} ></FontSwitcher>
        </div>
    );
};

// Section 組件
const Section: React.FC<SectionProps> = ({
    title,
    children,
    section,
    isExpanded,
    onToggle
}) => (
    <div className="border rounded mb-2">
        <button
            className="w-full p-2 flex items-center justify-between bg-gray-50"
            onClick={() => onToggle(section)}
        >
            <span>{title}</span>
            {isExpanded ?
                <JamChevronCircleDown className="text-2xl" /> :
                <JamChevronCircleRight className="text-2xl" />
            }
        </button>
        {isExpanded && (
            <div className="p-2">
                {children}
            </div>
        )}
    </div>
);

// 主組件
const StyleConfigPanel: React.FC = () => {
    const [config, setConfig] = useState(defaultStyleConfig);

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        blockquotes: true,
        annotation: true,
        image: true,
        list: true,
        title: true,
        "title-H1": true,
        "title-H2": true,
        "title-H3": true,
        "title-H4": true,
        "title-H5": true,
        "title-H6": true,
        layout: true,
        pageFont: true,
        page: true
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const updateConfig = useCallback((path: string[], value: any) => {
        const newConfig = { ...config };
        let current: any = newConfig;

        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        // console.log(path, value)

        if (typeof value === 'number') {
            document.documentElement.style.setProperty("--" + path.join('-'), value.toString() + "px");
        } else {
            document.documentElement.style.setProperty("--" + path.join('-'), value + "");
        }

        setConfig(newConfig);
    }, [config, setConfig]);

    useEffect(() => {
        const initialconfig = localStorage.getItem('config');
        if (initialconfig) {
            const parsedconfig = JSON.parse(initialconfig);
            setConfig(parsedconfig)
        } else {
            localStorage.setItem('config', JSON.stringify(defaultStyleConfig))
        }
    }, [])

    useEffect(() => {
        if (config.init) {
            return
        }
        localStorage.setItem('config', JSON.stringify(config))
    }, [config])


    return (
        <div className="w-full bg-blue-50 p-4 overflow-y-auto h-full">
            <Section
                title="Page Settings"
                section="page"
                isExpanded={expandedSections.page}
                onToggle={toggleSection}
            >
                <Section
                    title="Font"
                    section="pageFont"
                    isExpanded={expandedSections.pageFont}
                    onToggle={toggleSection}
                >
                    <NumberInput
                        path={['page', 'font', 'size']}
                        label="Size"
                        config={config}
                        updateConfig={updateConfig}
                    />
                    <NumberInput
                        path={['page', 'font', 'weight']}
                        label="Weight"
                        step={100}
                        max={900}
                        config={config}
                        updateConfig={updateConfig}
                    />
                    <NumberInput
                        path={['page', 'font', 'height']}
                        label="Height"
                        step={100}
                        max={900}
                        config={config}
                        updateConfig={updateConfig}
                    />
                    <ColorInput
                        path={['page', 'font', 'color']}
                        label="Color"
                        config={config}
                        updateConfig={updateConfig}
                    />
                    <FontsInput
                        path={['page', 'font', 'family']}
                        label="family"
                        config={config}
                        updateConfig={updateConfig}
                    />
                </Section>
                <Section
                    title="Layout"
                    section="layout"
                    isExpanded={expandedSections.layout}
                    onToggle={toggleSection}
                >
                    <ColorInput
                        path={['page', 'layout', 'bgColor']}
                        label="Background"
                        config={config}
                        updateConfig={updateConfig}
                    />
                    <BooleanInput
                        path={['page', 'layout', 'pageNumber']}
                        label="PageNumber"
                        config={config}
                        updateConfig={updateConfig}
                    />
                    <StringInput
                        path={['page', 'layout', 'author']}
                        label="Author"
                        config={config}
                        updateConfig={updateConfig}
                    />
                    <StringInput
                        path={['page', 'layout', 'title']}
                        label="Title"
                        config={config}
                        updateConfig={updateConfig}
                    />
                    <NumberInput
                        path={['page', 'layout', 'tBoundary']}
                        label="Top boundary"
                        step={1}
                        max={900}
                        config={config}
                        updateConfig={updateConfig}
                    />
                    <NumberInput
                        path={['page', 'layout', 'bBoundary']}
                        label="Bottom boundary"
                        step={1}
                        max={900}
                        config={config}
                        updateConfig={updateConfig}
                    />
                    <NumberInput
                        path={['page', 'layout', 'lBoundary']}
                        label="Left boundary"
                        step={1}
                        max={900}
                        config={config}
                        updateConfig={updateConfig}
                    />
                    <NumberInput
                        path={['page', 'layout', 'rBoundary']}
                        label="Right boundary"
                        step={1}
                        max={900}
                        config={config}
                        updateConfig={updateConfig}
                    />

                </Section>
            </Section>

            {/* Title Settings Section */}
            <Section
                title="Title Settings"
                section="title"
                isExpanded={expandedSections.title}
                onToggle={toggleSection}
            >
                {['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].map((level) => (
                    <Section
                        key={level}
                        title={level}
                        section={`title-${level}`}
                        isExpanded={expandedSections[`title-${level}`]}
                        onToggle={toggleSection}
                    >
                        <h4 className="font-medium mb-2">{level}</h4>
                        <NumberInput
                            path={['title', level, 'size']}
                            label="Size"
                            config={config}
                            updateConfig={updateConfig}
                        />
                        <NumberInput
                            path={['title', level, 'weight']}
                            label="Weight"
                            step={100}
                            max={900}
                            config={config}
                            updateConfig={updateConfig}
                        />
                        <NumberInput
                            path={['title', level, 'tMargin']}
                            label="Top Margin"
                            step={1}
                            max={900}
                            config={config}
                            updateConfig={updateConfig}
                        />
                        <NumberInput
                            path={['title', level, 'bMargin']}
                            label="Bottom Margin"
                            step={1}
                            max={900}
                            config={config}
                            updateConfig={updateConfig}
                        />
                        <NumberInput
                            path={['title', level, 'scaling']}
                            label="Scaling"
                            step={1}
                            max={900}
                            config={config}
                            updateConfig={updateConfig}
                        />
                        <BooleanInput
                            path={['title', level, 'underline']}
                            label="Underline"
                            config={config}
                            updateConfig={updateConfig}
                        />
                        <ColorInput
                            path={['title', level, 'color']}
                            label="Color"
                            config={config}
                            updateConfig={updateConfig}
                        />
                        <StringInput
                            path={['title', level, 'decorativeSymbol']}
                            label="Decorative Symbol"
                            config={config}
                            updateConfig={updateConfig}
                        />
                    </Section>
                ))}
            </Section>

            {/* List Settings Section */}
            <Section
                title="List Settings"
                section="list"
                isExpanded={expandedSections.list}
                onToggle={toggleSection}
            >
                <div className="mb-4">
                    <h4 className="font-medium mb-2">Ordered Lists</h4>
                    < NumberInput
                        path={['list', 'orderedLists', 'scaling']}
                        label="Scaling"
                        step={1}
                        max={900}
                        config={config}
                        updateConfig={updateConfig}
                    />
                    {[1, 2, 3, 4, 5].map(n => (
                        <SelectInput
                            key={n}
                            path={['list', 'orderedLists', 'decorativeSymbol' + n]}
                            label={`Bullet Style ${n}`}
                            config={config}
                            updateConfig={updateConfig}
                            options={
                                [
                                    { name: "decimal (數字)", value: "decimal" },
                                    { name: "decimal-leading-zero (前置零數字)", value: "decimal-leading-zero" },
                                    { name: "lower-roman (小寫羅馬數字)", value: "lower-roman" },
                                    { name: "upper-roman (大寫羅馬數字)", value: "upper-roman" },
                                    { name: "lower-greek (小寫希臘字母)", value: "lower-greek" },
                                    { name: "lower-alpha (小寫拉丁字母)", value: "lower-alpha" },
                                    { name: "upper-alpha (大寫拉丁字母)", value: "upper-alpha" },
                                    { name: "arabic-indic (阿拉伯數字)", value: "arabic-indic" },
                                    // { name: "armenian (亞美尼亞數字)", value: "armenian" },
                                    // { name: "bengali (孟加拉數字)", value: "bengali" },
                                    // { name: "cambodian/khmer (柬埔寨數字)", value: "cambodian" },
                                    { name: "cjk-decimal (漢字數字)", value: "cjk-decimal" },
                                    { name: "cjk-earthly-branch (地支)", value: "cjk-earthly-branch" },
                                    { name: "cjk-heavenly-stem (天干)", value: "cjk-heavenly-stem" },
                                    { name: "cjk-ideographic (傳統漢字)", value: "cjk-ideographic" },
                                    { name: "devanagari (天城文數字)", value: "devanagari" },
                                    // { name: "ethiopic-numeric (埃塞俄比亞數字)", value: "ethiopic-numeric" },
                                    // { name: "georgian (格魯吉亞數字)", value: "georgian" },
                                    // { name: "gujarati (古吉拉特數字)", value: "gujarati" },
                                    // { name: "gurmukhi (古魯穆奇數字)", value: "gurmukhi" },
                                    // { name: "hebrew (希伯來數字)", value: "hebrew" },
                                    { name: "hiragana (平假名字母)", value: "hiragana" },
                                    // { name: "hiragana-iroha (平假名伊呂波)", value: "hiragana-iroha" },
                                    { name: "japanese-formal (日本正式數字)", value: "japanese-formal" },
                                    { name: "japanese-informal (日本非正式數字)", value: "japanese-informal" },
                                    // { name: "kannada (坎納達數字)", value: "kannada" },
                                    { name: "katakana (片假名字母)", value: "katakana" },
                                    // { name: "katakana-iroha (片假名伊呂波)", value: "katakana-iroha" },
                                    // { name: "korean-hangul-formal (韓文正式數字)", value: "korean-hangul-formal" },
                                    // { name: "korean-hanja-formal (韓文漢字正式數字)", value: "korean-hanja-formal" },
                                    // { name: "korean-hanja-informal (韓文漢字非正式數字)", value: "korean-hanja-informal" },
                                    { name: "lao (老撾數字)", value: "lao" },
                                    // { name: "lower-armenian (小寫亞美尼亞數字)", value: "lower-armenian" },
                                    // { name: "malayalam (馬拉雅拉姆數字)", value: "malayalam" },
                                    // { name: "mongolian (蒙古數字)", value: "mongolian" },
                                    // { name: "myanmar (緬甸數字)", value: "myanmar" },
                                    // { name: "oriya (奧里亞數字)", value: "oriya" },
                                    // { name: "persian (波斯數字)", value: "persian" },
                                    // { name: "tamil (泰米爾數字)", value: "tamil" },
                                    // { name: "telugu (泰盧固數字)", value: "telugu" },
                                    // { name: "thai (泰國數字)", value: "thai" },
                                    // { name: "tibetan (藏文數字)", value: "tibetan" },
                                    { name: "trad-chinese-formal (繁體中文正式數字)", value: "trad-chinese-formal" },
                                    { name: "trad-chinese-informal (繁體中文非正式數字)", value: "trad-chinese-informal" },
                                    // { name: "upper-armenian (大寫亞美尼亞數字)", value: "upper-armenian" }
                                ]
                            }
                        />
                    ))
                    }
                </div>
                <div>
                    <h4 className="font-medium mb-2">Unordered Lists</h4>
                    <NumberInput
                        path={['list', 'unorderedList', 'scaling']}
                        label="Scaling"
                        step={1}
                        max={900}
                        config={config}
                        updateConfig={updateConfig}
                    />
                    {[1, 2, 3, 4, 5].map(n => (
                        <SelectInput
                            key={n}
                            path={['list', 'unorderedList', 'decorativeSymbol' + n]}
                            label={`Bullet Style ${n}`}
                            config={config}
                            updateConfig={updateConfig}
                            options={
                                [
                                    { name: "none", value: "none" },
                                    { name: "disc", value: "disc" },
                                    { name: "circle", value: "circle" },
                                    { name: "square", value: "square" },
                                    { name: "disclosure-open", value: "disclosure-open" },
                                    { name: "disclosure-closed", value: "disclosure-closed" }
                                ]
                            }
                        />
                    ))
                    }
                </div>
            </Section>

            {/* Image Settings Section */}
            <Section
                title="Image Settings"
                section="image"
                isExpanded={expandedSections.image}
                onToggle={toggleSection}
            >
                <NumberInput
                    path={['image', 'radius']}
                    label="Border Radius"
                    config={config}
                    updateConfig={updateConfig}
                />
                <NumberInput
                    path={['image', 'annotation', 'size']}
                    label="Annotation Size"
                    config={config}
                    updateConfig={updateConfig}
                />
                <NumberInput
                    path={['image', 'tMargin']}
                    label="Top Margin"
                    step={1}
                    max={900}
                    config={config}
                    updateConfig={updateConfig}
                />
                <NumberInput
                    path={['image', 'bMargin']}
                    label="Bottom Margin"
                    step={1}
                    max={900}
                    config={config}
                    updateConfig={updateConfig}
                />
                <Section
                    title="Annotation"
                    section="annotation"
                    isExpanded={expandedSections.annotation}
                    onToggle={toggleSection}
                >

                    <NumberInput
                        path={['image', 'annotation', 'size']}
                        label="Size"
                        config={config}
                        updateConfig={updateConfig}
                    />
                    <NumberInput
                        path={['image', 'annotation', 'weight']}
                        label="Weight"
                        step={100}
                        max={900}
                        config={config}
                        updateConfig={updateConfig}
                    />
                    <ColorInput
                        path={['image', 'annotation', 'color']}
                        label="Color"
                        config={config}
                        updateConfig={updateConfig}
                    />
                    <StringInput
                        path={['image', 'annotation', 'decorativeSymbol']}
                        label="Decorative Symbol"
                        config={config}
                        updateConfig={updateConfig}
                    />

                </Section>
            </Section>

            {/* Blockquotes Settings Section */}
            <Section
                title="Blockquotes Settings"
                section="blockquotes"
                isExpanded={expandedSections.blockquotes}
                onToggle={toggleSection}
            >
                <NumberInput
                    path={['blockquotes', 'scaling']}
                    label="Scaling"
                    step={1}
                    max={900}
                    config={config}
                    updateConfig={updateConfig}
                />

                <ColorInput
                    path={['blockquotes', 'color']}
                    label="Color"
                    config={config}
                    updateConfig={updateConfig}
                />
                <NumberInput
                    path={['blockquotes', 'size']}
                    label="Size"
                    config={config}
                    updateConfig={updateConfig}
                />
                <NumberInput
                    path={['blockquotes', 'weight']}
                    label="Weight"
                    step={100}
                    max={900}
                    config={config}
                    updateConfig={updateConfig}
                />
            </Section>
        </div>
    );
};

export default StyleConfigPanel;