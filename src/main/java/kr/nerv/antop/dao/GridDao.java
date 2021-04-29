package kr.nerv.antop.dao;

import java.util.List;
import java.util.Map;

import kr.nerv.antop.model.GridModel;

public interface GridDao {
	final public static String TABLE_NAME = "sudoku_grid";
	
	public class Columns {
		final public static String SEQ = "seq";
		final public static String GRID = "grid";
		final public static String CREATED = "created";
		final public static String MODIFIED = "modified";
	}
	
	public int create(GridModel sudoku) throws Exception;

	public GridModel findById(int seq) throws Exception;

	public GridModel findByGrid(String grid) throws Exception;
	
	public List<GridModel> find(Map<String, Object> params) throws Exception;
	
	public int getCount() throws Exception;

	public int update(GridModel sudoku) throws Exception;

	public void delete(int seq) throws Exception;
}
