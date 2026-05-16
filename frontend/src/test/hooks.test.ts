import { vi, expect, beforeEach, test, describe } from "vitest";
import useToast from "../hooks/Toast.hook";
import { useModal } from "../hooks/Modal.hook";
import { useAuth } from "../hooks/Auth.hook";
import {
    useNotes,
    useNote,
    notesQueryKey,
    noteQueryKey,
} from "../hooks/Note.hook";
import type { ToastType } from "../types/toast.types";
import type { IModalContextType } from "../context/Modal.context";

// ─── Module mocks ────────────────────────────────────────────────

const { mockUseContext, mockUseQuery } = vi.hoisted(() => ({
    mockUseContext: vi.fn(),
    mockUseQuery: vi.fn(),
}));

vi.mock("react", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react")>();
    return {
        ...actual,
        useContext: mockUseContext,
        default: { ...actual, useContext: mockUseContext },
    };
});

vi.mock("@tanstack/react-query", () => ({
    useQuery: (...args: any[]) => mockUseQuery(...args),
}));
vi.mock("../api/Axios", () => ({ default: { get: vi.fn() } }));

// ─── Context factories ───────────────────────────────────────────

const makeToastCtx = () => ({
    showToast: vi.fn<(msg: string, type: ToastType) => void>(),
    removeToast: vi.fn<(msg: string) => void>(),
});

const makeModalCtx = () => ({
    confirm: vi.fn<IModalContextType['confirm']>(),
});

const makeAuthCtx = () => ({
    user: undefined,
    token: null,
    isAuthenticated: false,
    isInitialLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
});

// ─── Reset ───────────────────────────────────────────────────────

beforeEach(() => {
    mockUseContext.mockReset();
    mockUseQuery.mockReset();
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false });
});

// ─── useToast ────────────────────────────────────────────────────

describe("useToast test cases", () => {
    test("useToast – throws when outside ToastProvider", () => {
        mockUseContext.mockReturnValue(undefined);
        expect(() => useToast()).toThrowError(
            "useToast must be used within a ToastProvider",
        );
    });

    test("useToast – returns context when inside ToastProvider", () => {
        const ctx = makeToastCtx();
        mockUseContext.mockReturnValue(ctx);
        expect(useToast()).toBe(ctx);
    });

    test.each<[string, ToastType]>([
        ["Saved successfully", "success"],
        ["An error occurred", "error"],
        ["Processing", "info"],
        ["Warning", "warning"],
    ])(
        'useToast – showToast("%s", "%s") calls context with correct args',
        (message, type) => {
            const ctx = makeToastCtx();
            mockUseContext.mockReturnValue(ctx);
            useToast().showToast(message, type);
            expect(ctx.showToast).toHaveBeenCalledOnce();
            expect(ctx.showToast).toHaveBeenCalledWith(message, type);
        },
    );

    test("useToast – removeToast is called with the correct id", () => {
        const ctx = makeToastCtx();
        mockUseContext.mockReturnValue(ctx);
        useToast().removeToast("abc123");
        expect(ctx.removeToast).toHaveBeenCalledOnce();
        expect(ctx.removeToast).toHaveBeenCalledWith("abc123");
    });

    test("useToast – removeToast does not trigger showToast", () => {
        const ctx = makeToastCtx();
        mockUseContext.mockReturnValue(ctx);
        useToast().removeToast("xyz");
        expect(ctx.showToast).not.toHaveBeenCalled();
    });
});

// ─── useModal ────────────────────────────────────────────────────
describe("useModal test cases", () => {
    test("useModal – throws when outside ModalProvider", () => {
        mockUseContext.mockReturnValue(undefined);
        expect(() => useModal()).toThrowError(
            "useModal must be used within a ModalProvider",
        );
    });

    test("useModal – returns context when inside ModalProvider", () => {
        const ctx = makeModalCtx();
        mockUseContext.mockReturnValue(ctx);
        const result = useModal();
        expect(result).toBe(ctx);
        expect(result.confirm).toBeTypeOf("function");
    });
});

// ─── useAuth ─────────────────────────────────────────────────────

describe("useAuth test cases", () => {
    test("useAuth – throws when outside AuthProvider", () => {
        mockUseContext.mockReturnValue(undefined);
        expect(() => useAuth()).toThrowError(
            "useAuth must be used within an AuthProvider!",
        );
    });

    test("useAuth – returns context when inside AuthProvider", () => {
        const ctx = makeAuthCtx();
        mockUseContext.mockReturnValue(ctx);
        const result = useAuth();
        expect(result).toBe(ctx);
        expect(result.login).toBeTypeOf("function");
        expect(result.logout).toBeTypeOf("function");
    });
});

// ─── Note query keys ─────────────────────────────────────────────

describe("Note query", () => {
    test('notesQueryKey is ["notes"]', () => {
        expect(notesQueryKey).toEqual(["notes"]);
    });

    test("noteQueryKey converts a number id to a string", () => {
        expect(noteQueryKey(5)).toEqual(["note", "5"]);
    });

    test("noteQueryKey accepts a string id", () => {
        expect(noteQueryKey("abc")).toEqual(["note", "abc"]);
    });
});

// ─── useNotes ────────────────────────────────────────────────────

describe("useNotes test cases", () => {
    test("useNotes – calls useQuery with notesQueryKey", () => {
        useNotes();
        expect(mockUseQuery).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: notesQueryKey }),
        );
    });
});

// ─── useNote ─────────────────────────────────────────────────────

describe("useNote test cases", () => {
    test("useNote – calls useQuery with the correct noteQueryKey id", () => {
        useNote(3);
        expect(mockUseQuery).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: noteQueryKey(3) }),
        );
    });

    test("useNote – enabled when id is a finite number", () => {
        useNote(1);
        expect(mockUseQuery).toHaveBeenCalledWith(
            expect.objectContaining({ enabled: true }),
        );
    });

    test("useNote – disabled when id is NaN", () => {
        useNote(NaN);
        expect(mockUseQuery).toHaveBeenCalledWith(
            expect.objectContaining({ enabled: false }),
        );
    });

    test("useNote – disabled when id is Infinity", () => {
        useNote(Infinity);
        expect(mockUseQuery).toHaveBeenCalledWith(
            expect.objectContaining({ enabled: false }),
        );
    });
});
