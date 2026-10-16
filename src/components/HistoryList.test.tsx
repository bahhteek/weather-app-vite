import { describe, expect, it, vi } from "vitest"
import { HistoryList } from "./HistoryList"
import { screen, render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe('HistoryList', () => {
    it('should render the history list and call removeHistory when the remove button is clicked', async () => {
        const removeHistory = vi.fn()
        render(<HistoryList cities={["Астана", "Алматы"]} removeHistory={removeHistory} />)

        expect(screen.getByText('Астана, Алматы')).toBeInTheDocument()

        await userEvent.click(
          screen.getByRole("button", { name: "Очистить историю" }),
        );

        expect(removeHistory).toHaveBeenCalledOnce();
    })
})