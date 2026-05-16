import { vi, expect, beforeEach, test, describe } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateButton } from "../components/ui/CreateButton.ui";
import NoteCardSkeleton from "../components/ui/NoteCardSkeleton.ui";
import NoteCard from "../components/ui/NoteCard.ui";
import NoteGrid from "../components/ui/NoteGrid.ui";
import LoginCard from "../components/auth/LoginCard.auth";
import RegisterCard from "../components/auth/RegisterCard.auth";
import { ViewModeProvider } from "../context/ViewMode.context";
import type { INote } from "../types";
import type { ReactNode } from "react";

const renderWithViewMode = (ui: ReactNode) =>
    render(<ViewModeProvider>{ui}</ViewModeProvider>);

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

vi.mock("../hooks/CheckUsername.hook", () => ({
    useCheckUsername: () => "available",
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
    test("renders without crashing", () => {
        const { container } = render(<NoteCardSkeleton />);
        expect(container.firstChild).toBeTruthy();
    });

    test("has animate-pulse elements", () => {
        const { container } = render(<NoteCardSkeleton />);
        expect(
            container.querySelectorAll(".animate-pulse").length,
        ).toBeGreaterThan(0);
    });
});

// ─── CreateButton ─────────────────────────────────────────────────

describe("CreateButton", () => {
    test('renders default "+" icon', () => {
        render(<CreateButton onClick={vi.fn()} />);
        expect(screen.getByText("+")).toBeInTheDocument();
    });

    test("renders custom icon when provided", () => {
        render(
            <CreateButton onClick={vi.fn()} icon={<span>CustomIcon</span>} />,
        );
        expect(screen.getByText("CustomIcon")).toBeInTheDocument();
    });

    test("calls onClick when clicked", async () => {
        const onClick = vi.fn();
        render(<CreateButton onClick={onClick} />);
        await userEvent.click(screen.getByRole("button"));
        expect(onClick).toHaveBeenCalledOnce();
    });

    test("applies buttonColor to className", () => {
        render(<CreateButton onClick={vi.fn()} buttonColor="bg-red-500" />);
        expect(screen.getByRole("button").className).toContain("bg-red-500");
    });

    test("uses bg-indigo-400 when no buttonColor is provided", () => {
        render(<CreateButton onClick={vi.fn()} />);
        expect(screen.getByRole("button").className).toContain("bg-indigo-400");
    });
});

// ─── NoteCard ─────────────────────────────────────────────────────

describe("NoteCard", () => {
    test("renders title and content", () => {
        render(<NoteCard note={makeNote()} />);
        expect(screen.getByText("Test Note")).toBeInTheDocument();
        expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    test("does not render title when title is empty", () => {
        render(<NoteCard note={makeNote({ title: "" })} />);
        expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });

    test("calls onClick with note when the card is clicked", async () => {
        const onClick = vi.fn();
        const note = makeNote();
        render(<NoteCard note={note} onClick={onClick} />);
        await userEvent.click(screen.getByText("Test content"));
        expect(onClick).toHaveBeenCalledWith(note);
    });

    test("applies background color from note.color", () => {
        const { container } = render(
            <NoteCard note={makeNote({ color: "RED" })} />,
        );
        expect(
            (container.firstChild as HTMLElement).style.backgroundColor,
        ).toBe("rgba(248, 113, 113, 0.2)");
    });

    test("has no inline backgroundColor when color is null", () => {
        const { container } = render(
            <NoteCard note={makeNote({ color: null })} />,
        );
        expect(
            (container.firstChild as HTMLElement).style.backgroundColor,
        ).toBe("");
    });

    test("renders actions when actionsContext is provided", () => {
        mockUseNoteActions.mockReturnValue(<span>MockActions</span>);
        render(<NoteCard note={makeNote()} actionsContext="notes" />);
        expect(screen.getByText("MockActions")).toBeInTheDocument();
    });

    test("does not render actions when actionsContext is not provided", () => {
        mockUseNoteActions.mockReturnValue(<span>MockActions</span>);
        render(<NoteCard note={makeNote()} />);
        expect(screen.queryByText("MockActions")).not.toBeInTheDocument();
    });
});

// ─── NoteGrid ─────────────────────────────────────────────────────

describe("NoteGrid", () => {
    test("renders the correct number of skeletons matching skeletonCount when loading", () => {
        const { container } = renderWithViewMode(
            <NoteGrid notes={[]} isLoading skeletonCount={3} />,
        );
        expect((container.firstChild as HTMLElement).childElementCount).toBe(3);
    });

    test("displays default empty message when notes is empty", () => {
        renderWithViewMode(<NoteGrid notes={[]} />);
        expect(screen.getByText("No notes yet")).toBeInTheDocument();
    });

    test("displays a custom empty message", () => {
        renderWithViewMode(
            <NoteGrid notes={[]} emptyMessage="Nothing here" />,
        );
        expect(screen.getByText("Nothing here")).toBeInTheDocument();
    });

    test("renders the correct number of NoteCards from notes", () => {
        const notes = [
            makeNote({ id: 1, title: "Note A" }),
            makeNote({ id: 2, title: "Note B" }),
        ];
        renderWithViewMode(<NoteGrid notes={notes} />);
        expect(screen.getByText("Note A")).toBeInTheDocument();
        expect(screen.getByText("Note B")).toBeInTheDocument();
    });

    test("does not display empty message while loading", () => {
        renderWithViewMode(<NoteGrid notes={[]} isLoading />);
        expect(
            screen.queryByText("No notes yet"),
        ).not.toBeInTheDocument();
    });
});

// ─── LoginCard ────────────────────────────────────────────────────

describe("LoginCard", () => {
    test("shows the Sign in button", () => {
        render(<LoginCard onLogin={vi.fn()} isLoading={false} />);
        expect(
            screen.getByRole("button", { name: /sign in/i }),
        ).toBeInTheDocument();
    });

    test('shows "Processing..." when isLoading', () => {
        render(<LoginCard onLogin={vi.fn()} isLoading />);
        expect(screen.getByText("Processing...")).toBeInTheDocument();
    });

    test("validation: shows error when email is empty", async () => {
        render(<LoginCard onLogin={vi.fn()} isLoading={false} />);
        await userEvent.click(
            screen.getByRole("button", { name: /sign in/i }),
        );
        expect(
            screen.getByText("Email is required"),
        ).toBeInTheDocument();
    });

    test("validation: shows error when email is invalid", async () => {
        render(<LoginCard onLogin={vi.fn()} isLoading={false} />);
        const emailInput = screen.getByPlaceholderText("Email");
        // jsdom sanitizes type="email" values, bypass via Object.defineProperty
        Object.defineProperty(emailInput, "value", {
            configurable: true,
            writable: true,
            value: "notanemail",
        });
        fireEvent.change(emailInput);
        await userEvent.click(
            screen.getByRole("button", { name: /sign in/i }),
        );
        expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });

    test("validation: shows error when password is empty", async () => {
        render(<LoginCard onLogin={vi.fn()} isLoading={false} />);
        await userEvent.click(
            screen.getByRole("button", { name: /sign in/i }),
        );
        expect(
            screen.getByText("Password is required"),
        ).toBeInTheDocument();
    });

    test("validation: shows error when password is shorter than 8 characters", async () => {
        render(<LoginCard onLogin={vi.fn()} isLoading={false} />);
        await userEvent.type(
            screen.getByPlaceholderText("Password"),
            "1234567",
        );
        await userEvent.click(
            screen.getByRole("button", { name: /sign in/i }),
        );
        expect(
            screen.getByText("Password must be at least 8 characters"),
        ).toBeInTheDocument();
    });

    test("calls onLogin when the form is valid", async () => {
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
            screen.getByRole("button", { name: /sign in/i }),
        );
        expect(onLogin).toHaveBeenCalledWith({
            email: "user@example.com",
            password: "password123",
        });
    });

    test("does not call onLogin when the form is invalid", async () => {
        const onLogin = vi.fn();
        render(<LoginCard onLogin={onLogin} isLoading={false} />);
        await userEvent.click(
            screen.getByRole("button", { name: /sign in/i }),
        );
        expect(onLogin).not.toHaveBeenCalled();
    });

    test("toggles password visibility", async () => {
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
    test("shows the Sign up button", () => {
        render(<RegisterCard onRegister={vi.fn()} isLoading={false} />);
        expect(
            screen.getByRole("button", { name: /sign up/i }),
        ).toBeInTheDocument();
    });

    test('shows "Processing..." when isLoading', () => {
        render(<RegisterCard onRegister={vi.fn()} isLoading />);
        expect(screen.getByText("Processing...")).toBeInTheDocument();
    });

    test("validation: shows error when display_name is empty", async () => {
        render(<RegisterCard onRegister={vi.fn()} isLoading={false} />);
        await userEvent.click(screen.getByRole("button", { name: /sign up/i }));
        expect(
            screen.getByText("Username is required"),
        ).toBeInTheDocument();
    });

    test("validation: shows error when display_name is shorter than 3 characters", async () => {
        render(<RegisterCard onRegister={vi.fn()} isLoading={false} />);
        await userEvent.type(
            screen.getByPlaceholderText("Username"),
            "ab",
        );
        await userEvent.click(screen.getByRole("button", { name: /sign up/i }));
        expect(
            screen.getByText("Username must be at least 3 characters"),
        ).toBeInTheDocument();
    });

    test("validation: shows error when passwords do not match", async () => {
        render(<RegisterCard onRegister={vi.fn()} isLoading={false} />);
        await userEvent.type(
            screen.getByPlaceholderText("Password"),
            "password123",
        );
        await userEvent.type(
            screen.getByPlaceholderText("Confirm password"),
            "different123",
        );
        await userEvent.click(screen.getByRole("button", { name: /sign up/i }));
        expect(
            screen.getByText("Passwords do not match"),
        ).toBeInTheDocument();
    });

    test("calls onRegister when the form is valid", async () => {
        const onRegister = vi.fn();
        render(<RegisterCard onRegister={onRegister} isLoading={false} />);
        await userEvent.type(
            screen.getByPlaceholderText("Username"),
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
            screen.getByPlaceholderText("Confirm password"),
            "password123",
        );
        await userEvent.click(screen.getByRole("button", { name: /sign up/i }));
        expect(onRegister).toHaveBeenCalledWith(
            expect.objectContaining({
                display_name: "TestUser",
                email: "user@example.com",
                password: "password123",
            }),
        );
    });

    test("does not call onRegister when the form is invalid", async () => {
        const onRegister = vi.fn();
        render(<RegisterCard onRegister={onRegister} isLoading={false} />);
        await userEvent.click(screen.getByRole("button", { name: /sign up/i }));
        expect(onRegister).not.toHaveBeenCalled();
    });
});
