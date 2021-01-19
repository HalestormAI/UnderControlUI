import React from 'react';

type SystemInfo = {
    model: string
    hostname: string
}

type CpuFreqInfo = {
    current: number,
    min: number,
    max: number
}

type CpuInfo = {
    freq: [CpuFreqInfo],
    perc: number[],
    temp: number
}

type BaseMemoryInfo = {
    total: number,
    used: number,
    free: number,
    percent: number
}

type VirtualMemoryInfo = BaseMemoryInfo & {
    available: number,
    active: number,
    inactive: number,
    buffers: number,
    cached: number,
    shared: number,
    slab: number
}

type SwapMemoryInfo = BaseMemoryInfo & {
    sin: number,
    sout: number
}

type DiskInfo = {
    total: number,
    used: number,
    free: number,
    percent: number
}

type StatInfo = {
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

interface SysResponse {
    stats: StatInfo
}

export type {
    SysResponse,
    CpuInfo,
    StatInfo
};