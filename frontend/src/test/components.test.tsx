import { vi, expect, beforeEach, test, describe } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateButton } from "../components/ui/CreateButton.ui";
import NoteCardSkeleton from "../components/ui/NoteCardSkeleton.ui";
import NoteCard from "../components/ui/NoteCard.ui";
import NoteGrid from "../components/ui/NoteGrid.ui";
import LoginCard from "../components/auth/LoginCard.auth";
import RegisterCard from "../components/auth/RegisterCard.auth";
import type { INote } from "../types";

// ─── Module mocks ────────────────────────────────────────────────

const { mockNavigate, mockUseNoteActions } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockUseNoteActions: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../hooks/NoteAction.hook", () => ({
    useNoteActions: (...args: any[]) => mockUseNoteActions(...args),
}));

// ─── Fixtures ────────────────────────────────────────────────────

const makeNote = (overrides: Partial<INote> = {}): INote => ({
    id: 1,
    title: "Test Note",
    content: "Test content",
    color: null,
    is_pinned: false,
    archived_at: null,
    deleted_at: null,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    ...overrides,
});

beforeEach(() => {
    mockNavigate.mockReset();
    mockUseNoteActions.mockReset();
    mockUseNoteActions.mockReturnValue(null);
});

// ─── NoteCardSkeleton ─────────────────────────────────────────────

describe("NoteCardSkeleton", () => {
    test("renders mà không crash", () => {
        const { container } = render(<NoteCardSkeleton />);
        expect(container.firstChild).toBeTruthy();
    });

    test("có các phần tử animate-pulse", () => {
        const { container } = render(<NoteCardSkeleton />);
        expect(
            container.querySelectorAll(".animate-pulse").length,
        ).toBeGreaterThan(0);
    });
});

// ─── CreateButton ─────────────────────────────────────────────────

describe("CreateButton", () => {
    test('render icon mặc định "+"', () => {
        render(<CreateButton onClick={vi.fn()} />);
        expect(screen.getByText("+")).toBeInTheDocument();
    });

    test("render custom icon khi được truyền vào", () => {
        render(
            <CreateButton onClick={vi.fn()} icon={<span>CustomIcon</span>} />,
        );
        expect(screen.getByText("CustomIcon")).toBeInTheDocument();
    });

    test("gọi onClick khi click", async () => {
        const onClick = vi.fn();
        render(<CreateButton onClick={onClick} />);
        await userEvent.click(screen.getByRole("button"));
        expect(onClick).toHaveBeenCalledOnce();
    });

    test("áp dụng buttonColor vào className", () => {
        render(<CreateButton onClick={vi.fn()} buttonColor="bg-red-500" />);
        expect(screen.getByRole("button").className).toContain("bg-red-500");
    });

    test("dùng bg-indigo-400 khi không có buttonColor", () => {
        render(<CreateButton onClick={vi.fn()} />);
        expect(screen.getByRole("button").className).toContain("bg-indigo-400");
    });
});

// ─── NoteCard ─────────────────────────────────────────────────────

describe("NoteCard", () => {
    test("render title và content", () => {
        render(<NoteCard note={makeNote()} />);
        expect(screen.getByText("Test Note")).toBeInTheDocument();
        expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    test("không render title khi title rỗng", () => {
        render(<NoteCard note={makeNote({ title: "" })} />);
        expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });

    test("gọi onClick với note khi click vào card", async () => {
        const onClick = vi.fn();
        const note = makeNote();
        render(<NoteCard note={note} onClick={onClick} />);
        await userEvent.click(screen.getByText("Test content"));
        expect(onClick).toHaveBeenCalledWith(note);
    });

    test("áp dụng background color từ note.color", () => {
        const { container } = render(
            <NoteCard note={makeNote({ color: "RED" })} />,
        );
        expect(
            (container.firstChild as HTMLElement).style.backgroundColor,
        ).toBe("rgba(248, 113, 113, 0.2)");
    });

    test("không có inline backgroundColor khi color là null", () => {
        const { container } = render(
            <NoteCard note={makeNote({ color: null })} />,
        );
        expect(
            (container.firstChild as HTMLElement).style.backgroundColor,
        ).toBe("");
    });

    test("render actions khi có actionsContext", () => {
        mockUseNoteActions.mockReturnValue(<span>MockActions</span>);
        render(<NoteCard note={makeNote()} actionsContext="notes" />);
        expect(screen.getByText("MockActions")).toBeInTheDocument();
    });

    test("không render actions khi không có actionsContext", () => {
        mockUseNoteActions.mockReturnValue(<span>MockActions</span>);
        render(<NoteCard note={makeNote()} />);
        expect(screen.queryByText("MockActions")).not.toBeInTheDocument();
    });
});

// ─── NoteGrid ─────────────────────────────────────────────────────

describe("NoteGrid", () => {
    test("hiển thị đúng số skeleton theo skeletonCount khi loading", () => {
        const { container } = render(
            <NoteGrid notes={[]} isLoading skeletonCount={3} />,
        );
        expect((container.firstChild as HTMLElement).childElementCount).toBe(3);
    });

    test("hiển thị default empty message khi notes rỗng", () => {
        render(<NoteGrid notes={[]} />);
        expect(screen.getByText("Chưa có ghi chú nào")).toBeInTheDocument();
    });

    test("hiển thị custom empty message", () => {
        render(<NoteGrid notes={[]} emptyMessage="Không có gì cả" />);
        expect(screen.getByText("Không có gì cả")).toBeInTheDocument();
    });

    test("render đúng số lượng NoteCard theo notes", () => {
        const notes = [
            makeNote({ id: 1, title: "Note A" }),
            makeNote({ id: 2, title: "Note B" }),
        ];
        render(<NoteGrid notes={notes} />);
        expect(screen.getByText("Note A")).toBeInTheDocument();
        expect(screen.getByText("Note B")).toBeInTheDocument();
    });

    test("không hiển thị empty message khi đang loading", () => {
        render(<NoteGrid notes={[]} isLoading />);
        expect(
            screen.queryByText("Chưa có ghi chú nào"),
        ).not.toBeInTheDocument();
    });
});

// ─── LoginCard ────────────────────────────────────────────────────

describe("LoginCard", () => {
    test("hiển thị button Đăng nhập", () => {
        render(<LoginCard onLogin={vi.fn()} isLoading={false} />);
        expect(
            screen.getByRole("button", { name: /đăng nhập/i }),
        ).toBeInTheDocument();
    });

    test('hiển thị "Đang xử lý..." khi isLoading', () => {
        render(<LoginCard onLogin={vi.fn()} isLoading />);
        expect(screen.getByText("Đang xử lý...")).toBeInTheDocument();
    });

    test("validation: hiện lỗi khi email trống", async () => {
        render(<LoginCard onLogin={vi.fn()} isLoading={false} />);
        await userEvent.click(
            screen.getByRole("button", { name: /đăng nhập/i }),
        );
        expect(
            screen.getByText("Email không được để trống"),
        ).toBeInTheDocument();
    });

    test("validation: hiện lỗi khi email không hợp lệ", async () => {
        render(<LoginCard onLogin={vi.fn()} isLoading={false} />);
        const emailInput = screen.getByPlaceholderText("Email");
        // jsdom sanitizes type="email" values, bypass bằng Object.defineProperty
        Object.defineProperty(emailInput, "value", {
            configurable: true,
            writable: true,
            value: "notanemail",
        });
        fireEvent.change(emailInput);
        await userEvent.click(
            screen.getByRole("button", { name: /đăng nhập/i }),
        );
        expect(screen.getByText("Email không hợp lệ")).toBeInTheDocument();
    });

    test("validation: hiện lỗi khi password trống", async () => {
        render(<LoginCard onLogin={vi.fn()} isLoading={false} />);
        await userEvent.click(
            screen.getByRole("button", { name: /đăng nhập/i }),
        );
        expect(
            screen.getByText("Mật khẩu không được để trống"),
        ).toBeInTheDocument();
    });

    test("validation: hiện lỗi khi password ngắn hơn 8 ký tự", async () => {
        render(<LoginCard onLogin={vi.fn()} isLoading={false} />);
        await userEvent.type(screen.getByPlaceholderText("Password"), "1234567");
        await userEvent.click(
            screen.getByRole("button", { name: /đăng nhập/i }),
        );
        expect(
            screen.getByText("Mật khẩu phải có ít nhất 6 ký tự"),
        ).toBeInTheDocument();
    });

    test("gọi onLogin khi form hợp lệ", async () => {
        const onLogin = vi.fn();
        render(<LoginCard onLogin={onLogin} isLoading={false} />);
        await userEvent.type(
            screen.getByPlaceholderText("Email"),
            "user@example.com",
        );
        await userEvent.type(
            screen.getByPlaceholderText("Password"),
            "password123",
        );
        await userEvent.click(
            screen.getByRole("button", { name: /đăng nhập/i }),
        );
        expect(onLogin).toHaveBeenCalledWith({
            email: "user@example.com",
            password: "password123",
        });
    });

    test("không gọi onLogin khi form không hợp lệ", async () => {
        const onLogin = vi.fn();
        render(<LoginCard onLogin={onLogin} isLoading={false} />);
        await userEvent.click(
            screen.getByRole("button", { name: /đăng nhập/i }),
        );
        expect(onLogin).not.toHaveBeenCalled();
    });

    test("toggle hiển thị/ẩn password", async () => {
        render(<LoginCard onLogin={vi.fn()} isLoading={false} />);
        const passwordInput = screen.getByPlaceholderText("Password");
        const toggleBtn = screen
            .getAllByRole("button")
            .find((b) => b.getAttribute("type") === "button")!;
        expect(passwordInput).toHaveAttribute("type", "password");
        await userEvent.click(toggleBtn);
        expect(passwordInput).toHaveAttribute("type", "text");
    });
});

// ─── RegisterCard ─────────────────────────────────────────────────

describe("RegisterCard", () => {
    test("hiển thị button Đăng Ký", () => {
        render(<RegisterCard onRegister={vi.fn()} isLoading={false} />);
        expect(
            screen.getByRole("button", { name: /đăng ký/i }),
        ).toBeInTheDocument();
    });

    test('hiển thị "Đang xử lý..." khi isLoading', () => {
        render(<RegisterCard onRegister={vi.fn()} isLoading />);
        expect(screen.getByText("Đang xử lý...")).toBeInTheDocument();
    });

    test("validation: hiện lỗi khi display_name trống", async () => {
        render(<RegisterCard onRegister={vi.fn()} isLoading={false} />);
        await userEvent.click(screen.getByRole("button", { name: /đăng ký/i }));
        expect(
            screen.getByText("Tên người dùng không được để trống"),
        ).toBeInTheDocument();
    });

    test("validation: hiện lỗi khi display_name ngắn hơn 3 ký tự", async () => {
        render(<RegisterCard onRegister={vi.fn()} isLoading={false} />);
        await userEvent.type(screen.getByPlaceholderText("User Name"), "ab");
        await userEvent.click(screen.getByRole("button", { name: /đăng ký/i }));
        expect(
            screen.getByText("Tên người dùng không được nhỏ hơn 3 ký tự"),
        ).toBeInTheDocument();
    });

    test("validation: hiện lỗi khi mật khẩu không khớp", async () => {
        render(<RegisterCard onRegister={vi.fn()} isLoading={false} />);
        await userEvent.type(
            screen.getByPlaceholderText("Password"),
            "password123",
        );
        await userEvent.type(
            screen.getByPlaceholderText("Confirm Password"),
            "different123",
        );
        await userEvent.click(screen.getByRole("button", { name: /đăng ký/i }));
        expect(
            screen.getByText("Mật khẩu không trùng khớp"),
        ).toBeInTheDocument();
    });

    test("gọi onRegister khi form hợp lệ", async () => {
        const onRegister = vi.fn();
        render(<RegisterCard onRegister={onRegister} isLoading={false} />);
        await userEvent.type(
            screen.getByPlaceholderText("User Name"),
            "TestUser",
        );
        await userEvent.type(
            screen.getByPlaceholderText("Email"),
            "user@example.com",
        );
        await userEvent.type(
            screen.getByPlaceholderText("Password"),
            "password123",
        );
        await userEvent.type(
            screen.getByPlaceholderText("Confirm Password"),
            "password123",
        );
        await userEvent.click(screen.getByRole("button", { name: /đăng ký/i }));
        expect(onRegister).toHaveBeenCalledWith(
            expect.objectContaining({
                display_name: "TestUser",
                email: "user@example.com",
                password: "password123",
            }),
        );
    });

    test("không gọi onRegister khi form không hợp lệ", async () => {
        const onRegister = vi.fn();
        render(<RegisterCard onRegister={onRegister} isLoading={false} />);
        await userEvent.click(screen.getByRole("button", { name: /đăng ký/i }));
        expect(onRegister).not.toHaveBeenCalled();
    });
});
