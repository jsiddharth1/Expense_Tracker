package com.example.expensetracker.repository;

import com.example.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    @Modifying
    @Transactional
    @Query("UPDATE Expense e SET e.user.id = :newUserId WHERE e.user.id = :oldUserId")
    void reassignExpenses(@Param("oldUserId") Long oldUserId, @Param("newUserId") Long newUserId);

    List<Expense> findByUserId(Long userId);
    List<Expense> findByUserIdAndCategory(Long userId, String category);
    Optional<Expense> findByClientIdAndUserId(String clientId, Long userId);
    List<Expense> findByClientIdInAndUserId(List<String> clientIds, Long userId);
    Optional<Expense> findByIdAndUserId(Long id, Long userId);
}