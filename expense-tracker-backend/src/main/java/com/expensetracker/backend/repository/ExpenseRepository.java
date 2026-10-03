package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.Expense;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends MongoRepository<Expense, String> {
    List<Expense> findByUserIdOrderByDateDesc(String userId);
    List<Expense> findByUserIdAndCategoryOrderByDateDesc(String userId, String category);
    List<Expense> findTop5ByUserIdOrderByDateDesc(String userId);
    List<Expense> findByUserIdAndDateBetweenOrderByDateDesc(String userId, String startDate, String endDate);
}
