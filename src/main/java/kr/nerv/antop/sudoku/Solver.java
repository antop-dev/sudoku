package kr.nerv.antop.sudoku;

import java.util.List;

public interface Solver {
	public List<Grid> solve(String puzzle) throws Exception;

	public Grid create(String grid) throws Exception;
}
