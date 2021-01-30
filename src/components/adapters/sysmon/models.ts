export type SystemInfo = {
    model: string
    hostname: string
}

export type CpuFreqInfo = {
    current: number,
    min: number,
    max: number
}

export type CpuInfo = {
    freq: [CpuFreqInfo],
    perc: number[],
    temp: number
}

export type BaseMemoryInfo = {
    total: number,
    used: number,
    free: number,
    percent: number
}

export type VirtualMemoryInfo = BaseMemoryInfo & {
    available: number,
    active: number,
    inactive: number,
    buffers: number,
    cached: number,
    shared: number,
    slab: number
}

export type SwapMemoryInfo = BaseMemoryInfo & {
    sin: number,
    sout: number
}

export type DiskInfo = {
    total: number,
    used: number,
    free: number,
    percent: number
}

export type StatInfo = {
    system: SystemInfo,
    cpu: CpuInfo,
    memory: {
        virtual: VirtualMemoryInfo,
        swap: SwapMemoryInfo
    },
    disk?: {
        [diskName: string]: DiskInfo
    }
}

export interface SysResponse {
    stats: StatInfo
}