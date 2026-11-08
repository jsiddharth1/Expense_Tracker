package com.example.expensetracker.service;

import com.example.expensetracker.dto.GuestExpenseImportResult;
import com.example.expensetracker.model.Expense;
import com.example.expensetracker.model.User;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public List<Expense> getExpensesByUserId(Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    public List<Expense> getByCategory(Long userId, String category) {
        return expenseRepository.findByUserIdAndCategory(userId, category);
    }

    public Double getMonthlyTotal(Long userId, int month, int year) {
        return expenseRepository.findByUserId(userId)
                .stream()
                .filter(e -> e.getDate() != null
                           && e.getDate().getMonthValue() == month
                           && e.getDate().getYear() == year)
                .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                .sum();
    }

    public Double getAverageExpense(Long userId) {
        return expenseRepository.findByUserId(userId)
                .stream()
                .filter(e -> e.getAmount() != null)
                .mapToDouble(Expense::getAmount)
                .average()
                .orElse(0.0);
    }

    public Expense getExpenseByIdAndUserId(Long id, Long userId) {
        if (userId != null) {
            return expenseRepository.findByIdAndUserId(id, userId)
                    .orElseThrow(() -> new RuntimeException("Expense not found or unauthorized with id: " + id));
        }
        return getExpenseById(id);
    }

    public Expense updateExpense(Long id, Long userId, Expense updatedExpense) {
        Expense existing;
        if (userId != null) {
            existing = expenseRepository.findByIdAndUserId(id, userId)
                    .orElseThrow(() -> new RuntimeException("Expense not found or unauthorized with id: " + id));
        } else {
            existing = getExpenseById(id);
        }
        existing.setTitle(updatedExpense.getTitle());
        existing.setAmount(updatedExpense.getAmount());
        existing.setCategory(updatedExpense.getCategory());
        existing.setDescription(updatedExpense.getDescription());
        existing.setDate(updatedExpense.getDate());
        if (updatedExpense.getClientId() != null) {
            existing.setClientId(updatedExpense.getClientId());
        }
        return expenseRepository.save(existing);
    }

    public Expense updateExpense(Long id, Expense updatedExpense) {
        return updateExpense(id, null, updatedExpense);
    }

    public void deleteExpense(Long id, Long userId) {
        if (userId != null) {
            Expense existing = expenseRepository.findByIdAndUserId(id, userId)
                    .orElseThrow(() -> new RuntimeException("Expense not found or unauthorized with id: " + id));
            expenseRepository.delete(existing);
        } else {
            expenseRepository.deleteById(id);
        }
    }

    public void deleteExpense(Long id) {
        deleteExpense(id, null);
    }

    public GuestExpenseImportResult importGuestExpenses(Long userId, List<Expense> guestExpenses) {
        if (userId == null) {
            throw new RuntimeException("User ID is required for import");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        int createdCount = 0;
        int alreadyImportedCount = 0;
        int rejectedCount = 0;

        List<Expense> createdExpenses = new ArrayList<>();
        List<String> alreadyImportedClientIds = new ArrayList<>();
        List<String> rejectedReasons = new ArrayList<>();

        if (guestExpenses == null || guestExpenses.isEmpty()) {
            return GuestExpenseImportResult.builder()
                    .created(0)
                    .alreadyImported(0)
                    .rejected(0)
                    .createdExpenses(createdExpenses)
                    .alreadyImportedClientIds(alreadyImportedClientIds)
                    .rejectedReasons(rejectedReasons)
                    .build();
        }

        for (Expense expense : guestExpenses) {
            if (expense == null) {
                rejectedCount++;
                rejectedReasons.add("Null expense record");
                continue;
            }

            // Validate clientId
            String clientId = expense.getClientId();
            if (clientId == null || clientId.trim().isEmpty()) {
                rejectedCount++;
                rejectedReasons.add("Missing clientId for expense: " + expense.getTitle());
                continue;
            }

            // Validate required fields
            if (expense.getTitle() == null || expense.getTitle().trim().isEmpty()) {
                rejectedCount++;
                rejectedReasons.add("Missing title for clientId: " + clientId);
                continue;
            }

            if (expense.getAmount() == null || expense.getAmount() <= 0) {
                rejectedCount++;
                rejectedReasons.add("Invalid amount for expense: " + expense.getTitle());
                continue;
            }

            if (expense.getDate() == null) {
                rejectedCount++;
                rejectedReasons.add("Missing date for expense: " + expense.getTitle());
                continue;
            }

            // Duplicate detection per user: check if already imported
            Optional<Expense> existing = expenseRepository.findByClientIdAndUserId(clientId, userId);
            if (existing.isPresent()) {
                alreadyImportedCount++;
                alreadyImportedClientIds.add(clientId);
                continue;
            }

            // Valid and not imported yet - create new entity
            Expense newExpense = new Expense();
            newExpense.setTitle(expense.getTitle().trim());
            newExpense.setAmount(expense.getAmount());
            newExpense.setCategory(expense.getCategory() != null && !expense.getCategory().trim().isEmpty() 
                    ? expense.getCategory().trim() : "Other");
            newExpense.setDescription(expense.getDescription());
            newExpense.setDate(expense.getDate());
            newExpense.setClientId(clientId);
            newExpense.setUser(user);

            Expense saved = expenseRepository.save(newExpense);
            createdExpenses.add(saved);
            createdCount++;
        }

        return GuestExpenseImportResult.builder()
                .created(createdCount)
                .alreadyImported(alreadyImportedCount)
                .rejected(rejectedCount)
                .createdExpenses(createdExpenses)
                .alreadyImportedClientIds(alreadyImportedClientIds)
                .rejectedReasons(rejectedReasons)
                .build();
    }
}