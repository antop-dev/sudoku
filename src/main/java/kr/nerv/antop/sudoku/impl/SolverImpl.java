package kr.nerv.antop.sudoku.impl;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import kr.nerv.antop.sudoku.Grid;
import kr.nerv.antop.sudoku.Solver;

@Component
public class SolverImpl implements Solver {
	// 답을 구할 최대 갯수
	private int limit = 100;

	public List<Grid> solve(Grid grid) throws Exception {
		// 답안이 담길 List
		List<Grid> solutions = new ArrayList<Grid>();
		// 풀이
		solve(grid, solutions);
		
		return solutions;
	}
	
	public List<Grid> solve(String puzzle) throws Exception {
		Grid grid = create(puzzle);
		return solve(grid);
	}

	private void solve(Grid grid, List<Grid> solutions) {
		// Return if there is already a solution
		if (solutions.size() >= limit) {
			return;
		}

		// Find first empty cell
		int loc = grid.findEmptyCell();

		// If no empty cells are found, a solution is found
		if (loc < 0) {
			solutions.add(grid.clone());
			return;
		}

		// Try each of the 9 digits in this empty cell
		for (int n = 1; n < 10; n++) {
			if (grid.set(loc, n)) {
				// With this cell set, work on the next cell
				solve(grid, solutions);

				// Clear the cell so that it can be filled with another digit
				grid.clear(loc);
			}
		}
	}

	public Grid create(String puzzle) throws Exception {
		InputStream is = null;

		try {
			byte[] xmlStringByte = puzzle.getBytes("utf-8");
			is = new ByteArrayInputStream(xmlStringByte);

			// 한 줄의 텍스트를 스도쿠 Grid로 생성
			return Grid.create(new InputStreamReader(is));
		} catch (Exception e) {
			throw e;
		} finally {
			if (is != null) {
				try {
					is.close();
				} catch (Exception ignore) {
				}
			}
		}
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

}
